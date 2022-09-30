import React, {useState} from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';
import logo from './logo.svg';
import './App.css';
import IndexPage  from './pages/home';


function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      
      links: [
        httpBatchLink({
          url: '/trpc',
          // optional
          headers() {
            return {
              authorization: 'none',
            };
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <IndexPage/>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
