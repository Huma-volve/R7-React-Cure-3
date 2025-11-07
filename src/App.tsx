import { Outlet } from "react-router-dom"
import Navbar from "./components/reusable/Navbar"
import { fetchFavoritesFromServer } from "./redux/favoritesSlice";
import type { AppDispatch } from "./redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "./components/reusable/Footer";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFavoritesFromServer());
  }, [dispatch]);
  return (
     <main>
      <div className="md:mx-5 my-5">
        <Navbar />
        <Outlet />
      </div>

      <Footer /> 
    </main>
    
  )
}
