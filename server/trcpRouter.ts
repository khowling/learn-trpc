import * as trpc from '@trpc/server';
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';

import * as ws from 'ws';
import { z } from 'zod';
import {factoryOrderModel, itemSKUModel} from './schema/schemas.js'

import * as http from 'http'

import { EventEmitter } from 'events';

import {MongoClient, InsertOneResult, ChangeStreamInsertDocument} from 'mongodb';
import { ObjectId } from 'bson'

// An intersection type is defined using the ampersand & operator.

export type WithId<TSchema> = TSchema & {
  _id: string;
};

const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/dev?replicaSet=rs0");
await client.connect();

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();
const changeStream = client.db().collection('item').watch([
  { $match: {'operationType': { $in: ['insert']}}}
])

// Type inference
//export type ItemSKU = z.infer<typeof ItemSKU>; // string


const t = trpc.initTRPC.create();

function modelRoutes<T extends z.ZodTypeAny>(schema: T, coll: string) {
  type ZType = z.infer<typeof schema>
  
  return t.router({
    list: t.procedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.string().nullish(),
        }),
      )
/*      .output(z.array(schema)) */
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

      onAdd: t.procedure
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
            changeStream.on('change', onAdd);
            // unsubscribe function when client disconnects or stops subscribing
            return () => {
              changeStream.off('change', onAdd);
            };
          });
      })
  })
}


// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export const appRouter = t.router({
  item: modelRoutes(itemSKUModel, 'item')
});

export type AppRouter = typeof appRouter;

const port = process.env.PORT || 5000
console.log(port)
const httpServer = http.createServer(async function (req, res) {
    const { headers, method, url } = req

    console.log (`got: ${url}`)
    const href = url!.startsWith('/') ? `http://127.0.0.1${url}`  : req.url!
    // get procedure path and remove the leading slash
    // /procedure -> procedure
    const path = new URL(href).pathname;

    if (path.startsWith('/trpc/')) {
         
        await nodeHTTPRequestHandler({
        ...{
            router: appRouter,
            createContext() {
                return {};
            }
        }, req, res, path: path.slice(6) });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("404 Not Found\n");
    }
}).listen(port)
  

console.log ('websocket')
const wss = new ws.WebSocketServer({ server: httpServer });
const handler = applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext() {
    return {};
  },
});

wss.on('connection', (ws) => {
  console.log(`++ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`-- Connection (${wss.clients.size})`);
  });
});
console.log(`WebSocket Server listening on ws://<host>>:${port}`);

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});


