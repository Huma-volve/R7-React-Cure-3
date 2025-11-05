import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/reusable/Navbar";

export default function App() {
  const location = useLocation();
  const hideNavbarOn = ["/chat"];
  const shouldHideNavbar = hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <main>
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </main>
  );
}
