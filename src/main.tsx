import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css';
// Providers
import { RouterProvider } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/redux/store.ts';
import { router } from '@/routers/route.tsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <Toaster />
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>,
)
