import { FiSearch, FiBell, FiX } from "react-icons/fi";
import { RiMenu4Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { BsChatText } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, searchDoctors } from "@/redux/searchSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import NotificationsPopup from "./NotificationsPopup";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageName = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/doctors":
        return "Doctors";
      case "/booking":
        return "Booking";
      case "/favorite":
        return "Favorite";
      case "/checkout":
        return "Checkout";
      case "/booking'":
        return "Appointments";
      case "/map":
        return "Map";
      case "/profile-setting":
        return "Profile";
      default:
        return "";
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const searchValue = useSelector((state: RootState) => state.search.query);
  const user = useSelector((state: RootState) => state.auth.user);
  const {loading } = useSelector(
      (state: RootState) => state.search
    );
  const handleSearch = async () => {
    if (searchValue.trim() !== "") {
      await dispatch(searchDoctors(searchValue));
      navigate("/doctors");
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 bg-white w-full px-4 md:px-15 py-5 flex items-center justify-between overflow-hidden">
      {/* Logo */}
      <button
        className="flex items-center gap-2 mb-3 md:mb-0 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
      </button>

      {/* Search Bar */}
      <div
        className="
    relative items-center text-2xl bg-gray-100 rounded-lg px-3 py-2 
    w-full md:w-[330px] lg:w-[568px] h-10 mb-3 md:mb-0
    hidden md:flex
  "
      >
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search about specialty, doctor"
          value={searchValue}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          className="bg-transparent outline-none w-full text-[17px] text-gray-700"
        />

        {searchValue.trim() !== "" && (
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`absolute right-2 cursor-pointer px-3 py-1 rounded-md text-sm transition text-white 
                 ${loading ? "bg-gray-400" : "bg-[#145DB8] hover:bg-blue-700"}`}
            > 
            {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Searching...
                  </div>
                ) : (
                  "Search"
                )}
              </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4 text-xl">
        {!isOpen ? (
          <>
            <button
              onClick={() => setIsOpen(true)}
              className="text-black font-bold cursor-pointer bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105"
            >
              <RiMenu4Line />
            </button>

            {/* Notification */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-black bg-[#F5F6F7] cursor-pointer p-3 rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105">
                  <FiBell />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="z-100 p-0 border-none bg-background shadow-lg rounded-lg"
                align="end"
                sideOffset={8}
              >
                <NotificationsPopup />
              </PopoverContent>
            </Popover>

            <button
              className="text-black bg-[#F5F6F7] p-3 cursor-pointer rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105"
              onClick={() => navigate("/favorite")}
            >
              <FaRegHeart />
            </button>
             
             <button
              className="text-black bg-[#F5F6F7] p-3 cursor-pointer rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105"
              onClick={() => navigate("/chat")}
            >
              <BsChatText />
            </button>
            
            <button
              onClick={() => navigate("/profile-setting")}
              className="cursor-pointer"
            >
              <img
                src={user?.profile_photo||"/patient.jpg"}
                alt="profile"
                className="w-10 h-10 cursor-pointer rounded-full object-cover hover:shadow-md hover:border border-primary-700 transition-transform duration-300 hover:scale-108"
              />
            </button>
          </>
        ) : (
          <div className="flex flex-wrap items-center cursor-pointer justify-center gap-3 animate-slide-in-right">
            <span
              className="text-sm text-black cursor-pointer hover:bg-gray-200 bg-[#F5F6F7] px-4 py-3 rounded-lg font-medium"
              onClick={() => navigate("/")}
            >
              Home
            </span>

            {getPageName() !== "Home" && (
              <span className="text-sm text-black cursor-pointer hover:bg-gray-200 bg-[#F5F6F7] px-4 py-3 rounded-lg font-medium">
                {getPageName()}
              </span>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="text-black bg-[#F5F6F7] cursor-pointer p-3 hover:bg-gray-200 rounded-lg text-xl"
            >
              <FiX />
            </button>

            {/* Notification */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-black bg-[#F5F6F7] cursor-pointer p-3 rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105">
                  <FiBell />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="z-100 p-0 border-none shadow-lg rounded-lg"
              >
                <NotificationsPopup />
              </PopoverContent>
            </Popover>

            <button
              onClick={() => navigate("/favorite")}
              className="text-black font-bold cursor-pointer bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-200 transition-transform duration-300 hover:scale-105"
            >
              <FaRegHeart />
            </button>

             <button
              className="text-black bg-[#F5F6F7] p-3 cursor-pointer rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105"
              onClick={() => navigate("/chat")}
            >
              <BsChatText />
            </button>

            <button
              onClick={() => navigate("/profile-setting")}
              className="cursor-pointer"
            >
              <img
                src={user?.profile_photo||"/patient.jpg"}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer object-cover hover:shadow-md hover:border border-primary-700 transition-transform duration-300 hover:scale-108"
              />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;