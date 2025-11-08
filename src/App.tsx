import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/reusable/Navbar"
import Footer from "./components/reusable/Footer";
import ScrollToTop from "./components/reusable/ScrollToTop";


export default function App() {
  const location = useLocation();
  const hideNavbarOn = ["/chat" , '/signin','signup','verify-account','forget-password','reset-password','forget-password-otp'];
  const shouldHideNavbar = hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );
  const hideFooter = ["/chat" , '/signin','signup','verify-account','forget-password','reset-password','forget-password-otp'];
  const shouldHideFooter = hideFooter.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
     <main>
      <div className="md:mx-5 my-5">
         {!shouldHideNavbar && <Navbar />}
         <ScrollToTop />
        <div className="mt-20">
          <Outlet />
        </div>
      </div>

     {!shouldHideFooter && <Footer /> }
    </main>
    
  )
}
