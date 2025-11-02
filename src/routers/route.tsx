import { createBrowserRouter } from 'react-router-dom';
// Pages
import App from '@/App.tsx'
import Home from '@/pages/home';
import { SignupPage } from '@/pages/auth/SignupPage';
import { SignInPage } from '@/pages/auth/SignInPage';
// import { ForgetPassword } from '@/pages/auth/ForgetPassword';
import { OTPpage } from '@/pages/auth/OTPpage';
import DoctorsPage from '@/pages/DoctorsPage';
import FavoritePage from '@/pages/FavoritePage';
import { ProfileMain } from '@/pages/profile/ProfileMain';
import { ProfileEdit } from '@/pages/profile/ProfileEdit';
import Appointments from '@/pages/Booking/Appointment';
import DoctorDetails from '@/pages/DoctorDetails.tsx';
import Map from '@/components/reusable/Map';

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
        path: 'forget-password',
        element: <OTPpage />,
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
        path: 'doctors/booking',
        element: <Appointments />,
      },
      {
        path:"profile-setting", element:<ProfileMain/>
      }, 
      {
        path:"profile-edit", element:<ProfileEdit/>
      },
      {
        path: 'map',
        element: <Map />,
      }
    ]
  }
]);