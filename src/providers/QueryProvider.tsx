'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 2 times
            retry: 2,
            // Don't refetch on window focus for better mobile experience
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect for mobile data saving
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
