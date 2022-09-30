import * as trpc from '@trpc/server';
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
//import { applyWSSHandler } from '@trpc/server/adapters/ws';

//import  * as ws from "ws"
import { z } from 'zod';

import * as http from 'http'

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
  });

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;

// http server
/*
const { server, listen } = createHTTPServer({
    router: appRouter,
    createContext() {
      return {};
    },
  });
*/

console.log('5000')
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
}).listen(5000)
  
/*
  // ws server
  const wss = new ws.WebSocketServer({ server: httpServer });
  applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
*/