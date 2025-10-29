import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css';
// Providers
import { RouterProvider } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/redux/store.ts';
import { router } from '@/routers/route.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router}/>
    </ReduxProvider>
  </StrictMode>,
)
