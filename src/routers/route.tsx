import { createBrowserRouter } from 'react-router-dom';
// Pages
import App from '@/App.tsx'
import DoctorDetails from '@/pages/DoctorDetails.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <div>This is home</div>,
      },
      {
        path: 'doctors/:id',
        element: <DoctorDetails />,
      },
      {
        path: 'doctors/:id/booking',
        element: <div>This is payment</div>,
      },
    ]
  }
]);