

// @filename: client.ts
import { createTRPCReact, httpBatchLink } from '@trpc/react';
import type { AppRouter } from '../../../server/trcpRouter';
 
export const trpc = createTRPCReact<AppRouter>();



