import { useState } from "react";
import { FiSearch, FiBell, FiX } from "react-icons/fi";
import { RiMenu4Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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
      default:
        return "";
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      navigate("doctors");
      setSearchValue("");
    }
  };

  return (
    <nav className="relative w-full px-4 md:px-15 py-5 flex flex-wrap items-center justify-between bg-white overflow-hidden">
      {/* Logo */}
      <button
        className="flex items-center gap-2 mb-3 md:mb-0"
        onClick={() => navigate("/")}
      >
        <img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
      </button>

      {/* Search Bar */}
      <div
        className="relative flex items-center text-2xl bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-[568px] h-[40px] mb-3 md:mb-0"
      >
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search about specialty, doctor"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-transparent outline-none w-full text-[17px] text-gray-700"
        />
        {searchValue.trim() !== "" && (
          <button
            onClick={handleSearch}
            className="absolute right-2 bg-[#145DB8] text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Search
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4 text-xl">
        {!isOpen ? (
          <>
            {/* Menu Icon */}
            <button
              onClick={() => setIsOpen(true)}
              className="text-black font-bold bg-[#F5F6F7] p-3 rounded-lg transition-transform duration-300 hover:scale-105"
            >
              <RiMenu4Line />
            </button>

            {/* Notification */}
            <button className="text-black bg-[#F5F6F7] p-3 rounded-lg">
              <FiBell />
            </button>

            <button
              className="text-black bg-[#F5F6F7] p-3 rounded-lg"
              onClick={() => navigate("/favorite")}
            >
              <FaRegHeart />
            </button>

            {/* Profile */}
            <img
              src="/profile.png"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-in-right">
            <span
              className="text-sm text-black cursor-pointer bg-[#F5F6F7] px-4 py-3 rounded-lg font-medium"
              onClick={() => navigate("/")}
            >
              Home
            </span>

            {getPageName() !== "Home" && (
              <span className="text-sm text-black cursor-pointer bg-[#F5F6F7] px-4 py-3 rounded-lg font-medium">
                {getPageName()}
              </span>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="text-black bg-[#F5F6F7] p-3 rounded-lg text-xl"
            >
              <FiX />
            </button>

            <button className="text-black bg-[#F5F6F7] p-3 rounded-lg">
              <FiBell />
            </button>

            <button className="text-black font-bold bg-[#F5F6F7] p-3 rounded-lg">
              <FaRegHeart />
            </button>

            <img
              src="/profile.png"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
