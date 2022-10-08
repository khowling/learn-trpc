import * as trpc from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import {factoryOrderModel, itemSKUModel} from './schema/schemas.js'
import {MongoClient, ChangeStreamInsertDocument, ChangeStream, ChangeStreamDocument} from 'mongodb';
import { ObjectId } from 'bson'
import { TRPCError } from '@trpc/server';

export type WithId<TSchema> = TSchema & {
  _id: string;
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

        return (await client.db().collection(coll).find({}, { limit }).toArray()) as WithId<ZType>[]

      }),

      byId: t.procedure
        .input(z.object({
            id: z.string().regex(/^[0-9a-fA-F]{24}$/, "require ObjectId")
          })
        )
        .query(async ({input}) => {
          const { id } = input;
          const item =  (await client.db().collection(coll).findOne({_id: new ObjectId(id)})) as WithId<ZType>
          if (!item) {
            throw new trpc.TRPCError({
              code: 'NOT_FOUND',
              message: `No users with id '${id}'`,
            });
          }
          return item;
        }),

      add: t.procedure
        .input(schema)
        .mutation(async ({input}) => {
          const item = await client.db().collection(coll).insertOne(input as WithId<ZType>)
          return item;
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
            (changeStream as ChangeStream<Document, ChangeStreamDocument<Document>>).on('change', onAdd);
            // unsubscribe function when client disconnects or stops subscribing
            return () => {
              (changeStream as ChangeStream<Document, ChangeStreamDocument<Document>>).off('change', onAdd);
            };
          });
      }) :
        t.procedure.use(t.middleware(async ({ ctx, next }) =>  {throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' })})).subscription(() => '')
  })
}

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export const appRouter = t.router({
  item: modelRoutes(itemSKUModel, 'item', true)
});

export type AppRouter = typeof appRouter;

