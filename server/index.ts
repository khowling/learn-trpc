import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import * as http from 'http'
import * as ws from 'ws';
import type { AppRouter } from './trcpRouter.js';
import { appRouter } from './trcpRouter.js'

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




