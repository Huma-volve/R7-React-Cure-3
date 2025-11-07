import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// Pages
import App from '@/App.tsx'
import Home from '@/pages/home';
import PageSkeleton from '@/components/reusable/PageSkeleton';
import { SignupPage } from '@/pages/auth/SignupPage';
import { SignInPage } from '@/pages/auth/SignInPage';
import { OTPpage } from '@/pages/auth/OTPpage';
import { ProfileMain } from '@/pages/profile-setting/ProfileMain';
import { ForgetPassword } from '@/pages/ForgetPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { ForgetPasswordOTPPage } from '@/pages/auth/ForgetPasswordOTP';
import Chat from '@/pages/Chat/Chat';
import { EditOTP } from '@/pages/profile-setting/EditOTP';
import { SigninWithPhonePage } from '@/pages/auth/SigninWithPhonePage';
import { SigninWithPhoneOTPpage } from '@/pages/auth/SigninWithPhoneOTP';




// Lazily loaded
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));
const DoctorDetails = lazy(() => import('@/pages/DoctorDetails'));
const FavoritePage = lazy(() => import('@/pages/FavoritePage'));
const Appointments = lazy(() => import('@/pages/Booking/Appointment'));
const Map = lazy(() => import('@/components/reusable/Map'));
const PaymentConfirmationPage = lazy(() => import('@/components/reusable/payment/PayPageAndConfirmation'));

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
        path: 'verify-account',
        element: <OTPpage />,
      },
      {
        path: 'forget-password',
        element: <ForgetPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword/>,
      },
      {
        path: 'forget-password-otp',
        element: <ForgetPasswordOTPPage/>,
      },
      {
        path: 'new-phone-otp',
        element: <EditOTP/>,
      },
      {
        path: 'signin-phone',
        element: <SigninWithPhonePage/>,
      },
      {
        path: 'phone-login-otp',
        element: <SigninWithPhoneOTPpage/>,
      },
      {
        path: 'doctors',
        element: <Suspense fallback={<PageSkeleton />}>
          <DoctorsPage />
        </Suspense>,
      },
      {
        path: 'favorite',
        element: <Suspense fallback={<PageSkeleton />}>
          <FavoritePage />
        </Suspense>,
      },
      {
        path: 'doctor/:id',
        element: <Suspense fallback={<PageSkeleton />}>
          <DoctorDetails />
        </Suspense>,
      },
      {
        path: 'doctors/booking',
        element: <Suspense fallback={<PageSkeleton />}>
          <Appointments />
        </Suspense>,
      },
      {
        path:"profile-setting", element:<ProfileMain/>
      }, 
      {
        path: 'map',
        element: <Suspense fallback={<PageSkeleton />}>
          <Map />
        </Suspense>,
      },
      {
        path: 'checkout',
        element: <Suspense fallback={<PageSkeleton />}>
          <PaymentConfirmationPage />
        </Suspense>,
      },
      {
        path:"chat",
        element:<Chat />
      }
    ]
  }
]);