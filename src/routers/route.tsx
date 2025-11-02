import { createBrowserRouter } from 'react-router-dom';
// Pages
import App from '@/App.tsx'
import DoctorDetails from '@/pages/DoctorDetails.tsx';
import { SignupPage } from '@/pages/auth/SignupPage';
import { SignInPage } from '@/pages/auth/SignInPage';
import { ForgetPassword } from '@/pages/auth/ForgetPassword';
import { OTPpage } from '@/pages/auth/OTPpage';
// import Home from '@/pages/home';
// import DoctorsPage from '@/pages/DoctorsPage';
// import FavoritePage from '@/pages/FavoritePage';

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
      {
        path:"signup", element:<SignupPage/>
      },
      {
        path:"signin", element:<SignInPage/>
      },
      {
        path:"forget-password", element:<ForgetPassword/>
      },
      {
        path:"verify", element:<OTPpage/>
      },
    ]
  }
]);