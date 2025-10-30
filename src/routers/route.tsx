import { createBrowserRouter } from 'react-router-dom';
// Pages
import App from '@/App.tsx'
import DoctorDetails from '@/pages/DoctorDetails.tsx';
import DoctorsPage from '@/pages/DoctorsPage';
import Home from '@/pages/home';
import FavoritePage from '@/pages/FavoritePage';
import Appointments from '@/pages/Booking/Appointment';
import { SignInPage } from '@/pages/SignInPage';
import { SignupPage } from '@/pages/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home/>,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage/>,
      },
      {
        path: 'favorite',
        element: <FavoritePage/>,
      },
      {
        path: 'doctors/:id',
        element: <DoctorDetails />,
      },
      {
        path: 'booking',
        element: <Appointments />,
      },
    ]
  }
]);