import * as trpc from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import {recordId, factoryOrderModel, itemSKUModel} from './schema/schemas.js'
import {MongoClient, ChangeStreamInsertDocument, ChangeStream, ChangeStreamDocument, WithId, Document} from 'mongodb';
import { ObjectId } from 'bson'
import { TRPCError } from '@trpc/server';

export type ZodError = z.ZodError
export type WithWebId<TSchema> = TSchema & {
  id: string;
};

const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/dev?replicaSet=rs0");
await client.connect();

const t = trpc.initTRPC.create();

function modelRoutes<T extends z.ZodTypeAny>(schema: T, coll: string, enableSubscription: boolean) {
  type ZType = z.infer<typeof schema>

  // Change Stream for subscription websocket routes
  const changeStream = enableSubscription && client.db().collection(coll).watch([
    { $match: {'operationType': { $in: ['insert']}}}
  ])

  function idTransform<T>  (rec: WithId<Document>): WithWebId<T>  {
    const {_id, ...rest} : { _id: ObjectId} = rec
    return {id: _id.toHexString(), ...rest as T}
  }
  
  return t.router({
    list: t.procedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.string().nullish(),
        }),
      )
      .query(async ({ input }) => {
        /**
         * For pagination docs you can have a look here
         * @see https://trpc.io/docs/useInfiniteQuery
         * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
         */

        const limit = input.limit ?? 50;
        const projection = {name: 1,type: 1, tags:1 }

        const items = (await client.db().collection(coll).find({}, { limit, projection }).toArray()).map((d) => idTransform<ZType>(d))
        return items

      }),

      byId: t.procedure
        .input(recordId)
        .query(async ({input}) => {
          const { id } = input;
          const item =  await client.db().collection(coll).findOne({_id: new ObjectId(id)})
          if (!item) {
            throw new trpc.TRPCError({
              code: 'NOT_FOUND',
              message: `No users with id '${id}'`,
            });
          }
          return idTransform<ZType>(item) 
        }),

      add: t.procedure
        .input(schema.and(recordId.partial({id: true})))
        .mutation(async ({input} : {input: WithId<ZType>}) => {
          if (!input.id) {
            const item = await client.db().collection(coll).insertOne(input)
            return item;
          } else {
            const {id, ...rest} = input
            const item = await client.db().collection(coll).updateOne({_id: new ObjectId(id)},{ $set: rest })
            return item
          }
        }),

      onAdd: enableSubscription ? t.procedure
        .subscription(() => {
          // `resolve()` is triggered for each client when they start subscribing `onAdd`
          // return an `observable` with a callback which is triggered immediately
          return observable<WithId<ZType>>((emit) => {
            
            const onAdd = (data: ChangeStreamInsertDocument<WithId<ZType>>) => {
              // emit data to client
              const output = data.fullDocument
              console.log (output)
              emit.next(output);
            };


            // trigger `onAdd()` when `add` is triggered in our event emitter
            const em = changeStream && changeStream.on('change', onAdd);
            em && console.log(em.listenerCount('change'))
            // unsubscribe function when client disconnects or stops subscribing
            return () => {
              const em = changeStream && changeStream.off('change', onAdd);
              em && console.log(em.listenerCount('change'))
            };
          });
      }) :
        t.procedure.use(t.middleware(async ({ ctx, next }) =>  {throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED', message: 'Subscriptions have not been enabled for this collection' })})).subscription(() => '')
  })
}


export const appRouter = t.router({
  item: modelRoutes(itemSKUModel, 'item', true),
  order: modelRoutes(factoryOrderModel, 'order', false)
});

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;

