import * as trpc from '@trpc/server';
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';

import  * as ws from "ws"
import { z } from 'zod';

import * as http from 'http'

import { EventEmitter } from 'events';

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();


interface Post {
  id: string;
  data: String;
}

interface User {
    id: string;
    name: string;
}
   
const userList: User[] = [
  {
    id: '1',
    name: 'KATT',
  },
];




const t = trpc.initTRPC.create();

const appRouter = t.router({

    userById: t.procedure
      .input((val: unknown) => {
        if (typeof val === 'string') return val;
        throw new Error(`Invalid input: ${typeof val}`);
      })
      .query((req) => {
        const { input } = req;
        const user = userList.find((u) => u.id === input);
   
        return user;
      }),

    userCreate: t.procedure
      .input(z.object({ name: z.string() }))
      .mutation((req) => {
        const id = `${Math.random()}`;
        const user: User = {
          id,
          name: req.input.name,
        };
        userList.push(user);
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
