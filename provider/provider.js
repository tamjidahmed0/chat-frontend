'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProvidesTheQueryClient = ({children}) => {
   return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
   ); 
}

export default ProvidesTheQueryClient