import * as trpc from '@trpc/server';
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';

import  * as ws from "ws"
import { z } from 'zod';

import * as http from 'http'

import { EventEmitter } from 'events';

// ORM
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();


interface Post {
  id: string;
  data: String;
}


const t = trpc.initTRPC.create();

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true
});

const appRouter = t.router({
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
      const { cursor } = input;

      const users = await prisma.user.findMany({
        select: defaultUserSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = users.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: users.reverse(),
        nextCursor,
      };
    }),

    userById: t.procedure
      .input(z.object({
          id: z.string()
        })
      )
      .query(async ({input}) => {
        const { id } = input;
        const user =  await prisma.user.findUnique({
          select: defaultUserSelect,
          where: {id}
        });
        if (!user) {
          throw new trpc.TRPCError({
            code: 'NOT_FOUND',
            message: `No users with id '${id}'`,
          });
        }
        return user;
      }),

    userCreate: t.procedure
      .input(
        z.object({
          email: z.string().min(1).max(32),
          name: z.string().min(1)
        })
      )
      .mutation(async ({input}) => {
        const id = `${Math.random()}`;

        const user = await prisma.user.create({
          data: input
        });
        return user;
      }),

    onEvent: t.procedure.subscription(() => {
      // `resolve()` is triggered for each client when they start subscribing `onAdd`
      // return an `observable` with a callback which is triggered immediately
      return observable<Post>((emit) => {
        const onAdd = (data: Post) => {
          // emit data to client
          emit.next(data);
        };
        // trigger `onAdd()` when `add` is triggered in our event emitter
        ee.on('add', onAdd);
        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          ee.off('add', onAdd);
        };
      });
    })
  });

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
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
