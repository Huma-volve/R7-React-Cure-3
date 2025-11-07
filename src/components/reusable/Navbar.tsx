import { FiSearch, FiBell, FiX } from "react-icons/fi";
import { RiMenu4Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, searchDoctors } from "@/redux/searchSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";

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
      default:
        return "";
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const searchValue = useSelector((state: RootState) => state.search.query);

  const handleSearch = async () => {
    if (searchValue.trim() !== "") {
      await dispatch(searchDoctors(searchValue));
      navigate("doctors");
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
        className="
    relative items-center text-2xl bg-gray-100 rounded-lg px-3 py-2 
    w-full sm:w-[568px] h-10 mb-3 md:mb-0
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
            <button
              onClick={() => setIsOpen(true)}
              className="text-black font-bold bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105"
            >
              <RiMenu4Line />
            </button>

            <button className="text-black bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105">
              <FiBell />
            </button>

            <button
              className="text-black bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105"
              onClick={() => navigate("/favorite")}
            >
              <FaRegHeart />
            </button>

            <img
              src="/profile.png"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover hover:shadow-md hover:border border-primary-700 transition-transform duration-300 hover:scale-108"
            />
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-in-right">
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
              className="text-black bg-[#F5F6F7] p-3 hover:bg-gray-200 rounded-lg text-xl"
            >
              <FiX />
            </button>

            <button className="text-black bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-200 transition-transform duration-300 hover:scale-105">
              <FiBell />
            </button>

            <button className="text-black font-bold bg-[#F5F6F7] p-3 rounded-lg hover:bg-gray-200 transition-transform duration-300 hover:scale-105">
              <FaRegHeart />
            </button>

            <img
              src="/profile.png"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover hover:shadow-md hover:border border-primary-700 transition-transform duration-300 hover:scale-108"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

{
  /* Sidebar (Filter) */
}
//       <AnimatePresence>
//   {showFilters && (
//     <motion.aside
//       initial={{ opacity: 0, x: -40 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -40 }}
//       transition={{ duration: 0.35, ease: "easeInOut" }}
//       className="hidden lg:block w-67 bg-white shadow-md border border-gray-200 p-5 rounded-xl"
//     >
//       <h1 className="text-lg font-semibold mb-5">Filter Options</h1>

//       <div className="space-y-6 text-gray-700">
//         {/* Available Date */}
//         <div>
//           <h4 className="font-semibold mb-2">Available Date</h4>
//           <div className="flex flex-col gap-2">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" /> Today
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="checkbox" /> Tomorrow
//             </label>
//           </div>
//         </div>

//         {/* Gender */}
//         <div>
//           <h4 className="font-semibold mb-2">Gender</h4>
//           <div className="flex gap-3">
//             <button className="px-4 py-1 rounded-lg border bg-blue-600 text-white font-medium">
//               Male
//             </button>
//             <button className="px-4 py-1 rounded-lg border text-gray-700">
//               Female
//             </button>
//           </div>
//         </div>

//         {/* Consultation Type */}
//         <div>
//           <h4 className="font-semibold mb-2">Consultation Type</h4>
//           <div className="flex flex-col gap-2">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" /> In-clinic
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="checkbox" /> Home Visit
//             </label>
//           </div>
//         </div>

//         {/* Sort */}
//         <div>
//           <h4 className="font-semibold mb-2">Sort</h4>
//           <div className="flex flex-col gap-2">
//             <label className="flex items-center gap-2">
//               <input type="radio" name="sort" /> Most recommended
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="radio" name="sort" /> Price Low to High
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="radio" name="sort" /> Price High to Low
//             </label>
//           </div>
//         </div>
//       </div>
//     </motion.aside>
//   )}
// </AnimatePresence>
