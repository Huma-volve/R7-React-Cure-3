import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/reusable/Navbar"
import Footer from "./components/reusable/Footer";
import ScrollToTop from "./components/reusable/ScrollToTop";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect"




export default function App() {
  useAuthRedirect(); 
  const location = useLocation();
  const hideNavbarOn = ["/chat" , '/signin','/signup','/verify-account','/forget-password','/reset-password','/forget-password-otp', '/new-phone-otp', '/signin-phone', '/phone-login-otp'];
  const shouldHideNavbar = hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );
  const hideFooter = ["/chat" , '/signin','/signup','/verify-account','/forget-password','/reset-password','/forget-password-otp' , '/new-phone-otp', '/signin-phone', '/phone-login-otp'];
  const shouldHideFooter = hideFooter.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
     <main>
      <div className="">
         {!shouldHideNavbar &&  <Navbar />}
         <ScrollToTop />
        <div className={!shouldHideNavbar ? "mt-20" : ""}>
          <Outlet />
        </div>
      </div>

     {!shouldHideFooter && <Footer /> }
    </main>
    
  )
}
