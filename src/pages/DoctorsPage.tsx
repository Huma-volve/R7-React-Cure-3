import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { VscSettings } from "react-icons/vsc";
import { IoChevronDownSharp } from "react-icons/io5";
import SpecialtiesSlider from "@/components/reusable/SpecialtiesSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavoritesFromServer,
  toggleFavoriteOnServer,
} from "@/redux/favoritesSlice";
import {
  searchDoctors,
  setQuery,
  resetResults,
  fetchAllDoctors,
} from "@/redux/searchSlice";
import DoctorCard from "@/components/reusable/DoctorCard";
import type { AppDispatch, RootState } from "@/redux/store";

const DoctorsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector((state: RootState) => state.favorites.list);
  const { results, loading, query } = useSelector(
    (state: RootState) => state.search
  );

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchFavoritesFromServer());
  }, [dispatch]);

  const handleSearch = () => {
    if (!query.trim()) {
      dispatch(resetResults());
      return;
    }
    dispatch(searchDoctors(query));
  };

  useEffect(() => {
    if (!query.trim()) dispatch(resetResults());
  }, [query, dispatch]);

  const toggleFavorite = (id: number) => {
    dispatch(toggleFavoriteOnServer(id));
  };

  return (
    <div className="bg-white min-h-screen px-3 md:px-16 py-8 overflow-hidden">
      {/* Header + Search + Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="hidden md:flex items-center justify-between text-[#6D7379] border-2 border-gray-300 bg-white px-4 rounded-lg w-36 h-14"
        >
          <div className="flex items-center gap-2">
            <VscSettings size={18} /> <span>Filter</span>
          </div>
          <div className="w-[1.5px] h-full bg-[#ced5d4] mx-2"></div>
          <IoChevronDownSharp size={16} className="text-[#6D7379]" />
        </button>

        <div className="flex gap-3 w-full">
          <div className="flex-1 flex justify-center border-2 border-gray-300 py-1 pr-1 pl-4 rounded-lg h-14 w-full">
            <input
              type="text"
              placeholder="Search doctors"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              className="bg-transparent w-full outline-none text-xl"
            />
            {query && (
              <button
                onClick={handleSearch}
                className="ml-2 bg-[#145DB8] text-white px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex md:hidden items-center justify-between text-[#6D7379] border-2 border-gray-300 bg-white px-4 rounded-lg w-[100px] h-14"
          >
            <div className="flex items-center gap-2">
              <VscSettings size={18} /> <span>Filter</span>
            </div>
          </button>
        </div>
        <button className="hidden md:flex items-center gap-2 text-[#6D7379] border-2 border-gray-300 bg-white px-5 py-2 rounded-xl hover:bg-gray-100 transition h-14">
          <MapPin size={18} /> Map
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* ===== Desktop Sidebar ===== */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="hidden lg:block w-67 bg-white shadow-md border border-gray-200 p-5 rounded-xl"
            >
              <h1 className="text-lg font-semibold mb-5">Filter Options</h1>

              <div className="space-y-6 text-gray-700">
                {/* Available Date */}
                <div>
                  <h4 className="font-semibold mb-2">Available Date</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> Today
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> Tomorrow
                    </label>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <h4 className="font-semibold mb-2">Gender</h4>
                  <div className="flex gap-3">
                    <button className="px-4 py-1 rounded-lg border bg-blue-600 text-white font-medium">
                      Male
                    </button>
                    <button className="px-4 py-1 rounded-lg border text-gray-700">
                      Female
                    </button>
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <h4 className="font-semibold mb-2">Consultation Type</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="consultation" /> In-clinic
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="consultation" /> Home Visit
                    </label>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="font-semibold mb-2">Sort</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="sort" /> Most recommended
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="sort" /> Price Low to High
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="sort" /> Price High to Low
                    </label>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ===== Mobile Sidebar (Slide + Overlay) ===== */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />

              {/* Slide Menu */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.35 }}
                className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg p-5 z-50 overflow-y-auto lg:hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-lg font-semibold">Filter Options</h1>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6 text-gray-700">
                  {/* Available Date */}
                  <div>
                    <h4 className="font-semibold mb-2">Available Date</h4>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> Today
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> Tomorrow
                      </label>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <h4 className="font-semibold mb-2">Gender</h4>
                    <div className="flex gap-3">
                      <button className="px-4 py-1 rounded-lg border bg-blue-600 text-white font-medium">
                        Male
                      </button>
                      <button className="px-4 py-1 rounded-lg border text-gray-700">
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <h4 className="font-semibold mb-2">Consultation Type</h4>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> In-clinic
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> Home Visit
                      </label>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-semibold mb-2">Sort</h4>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="sort-mobile" /> Most
                        recommended
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="sort-mobile" /> Price Low to
                        High
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="sort-mobile" /> Price High to
                        Low
                      </label>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div className="flex-1 min-w-0 w-full px-2 md:px-0">
          <h2 className="text-2xl font-semibold mb-6">Choose Specialties</h2>
          <SpecialtiesSlider isSidebarOpen={showFilters} />

          {loading && <p className="text-center py-8 text-lg">Loading...</p>}

          {!loading && results.length === 0 && (
            <p className="text-center py-8 text-lg text-gray-500">
              No doctors found.
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((doc: any) => (
                <DoctorCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.user?.name}
                  specialty={doc.specialty?.name}
                  clinic={doc.clinic_address}
                  rating={doc.average_rating}
                  time="متاح الآن"
                  price={doc.session_price}
                  image={doc.user?.profile_photo ?? "avatar.PNG"}
                  isFavorite={favorites.includes(doc.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorsPage;
