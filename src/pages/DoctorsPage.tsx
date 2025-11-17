import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { VscSettings } from "react-icons/vsc";
import { IoChevronDownSharp } from "react-icons/io5";
import SpecialtiesSlider from "@/components/reusable/SpecialtiesSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  checkFavoriteStatus,
  toggleFavoriteOnServer,
} from "@/redux/favoritesSlice";
import {
  searchDoctors,
  setQuery,
  resetResults,
  fetchAllDoctors,
} from "@/redux/searchSlice";
import {
  setGender,
  setConsultation,
  setSort,
  setAvailableDay,
} from "@/redux/filtersSlice";
import DoctorCard from "@/components/reusable/DoctorCard";
import type { AppDispatch, RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const DoctorsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const favorites = useSelector((state: RootState) => state.favorites.list);

  const { results, originalData, loading, query, currentPage, lastPage } =
    useSelector((state: RootState) => state.search);
  const { gender, consultation, sort, availableDay } = useSelector(
    (state: RootState) => state.filters
  );

  let doctorsToShow = query.trim() ? results ?? [] : originalData ?? [];

  if (gender) {
    doctorsToShow = doctorsToShow.filter(
      (doc: any) => doc.user?.gender === gender
    );
  }

  if (consultation) {
    doctorsToShow = doctorsToShow.filter(
      (doc: any) => doc.consultation === consultation
    );
  }

  // Sort
  if (sort === "recommend") {
    doctorsToShow = [...doctorsToShow].sort(
      (a: any, b: any) => Number(b.average_rating) - Number(a.average_rating)
    );
  }

  if (sort === "low-high") {
    doctorsToShow = [...doctorsToShow].sort(
      (a: any, b: any) => Number(a.session_price) - Number(b.session_price)
    );
  }

  if (sort === "high-low") {
    doctorsToShow = [...doctorsToShow].sort(
      (a: any, b: any) => Number(b.session_price) - Number(a.session_price)
    );
  }
  const goNext = () => {
    if (currentPage < lastPage) {
      dispatch(fetchAllDoctors(+currentPage + 1));
    }
  };

  const goPrev = () => {
    if (+currentPage > 1) {
      dispatch(fetchAllDoctors(+currentPage - 1));
    }
  };

  if (availableDay.length > 0) {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayIndex = new Date().getDay();
    const todayName = days[todayIndex];
    const tomorrowName = days[(todayIndex + 1) % 7];

    doctorsToShow = doctorsToShow.filter((doc: any) => {
      const availability = doc.availability;
      if (!availability) return false;

      const isToday =
        availability[todayName] &&
        Object.keys(availability[todayName]).length > 0;
      const isTomorrow =
        availability[tomorrowName] &&
        Object.keys(availability[tomorrowName]).length > 0;

      return (
        (availableDay.includes("today") && isToday) ||
        (availableDay.includes("tomorrow") && isTomorrow)
      );
    });
  }

  useEffect(() => {
    doctorsToShow.forEach((doc: any) => {
      if (!favorites.includes(doc.id)) {
        dispatch(checkFavoriteStatus(Number(doc.id)));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(fetchAllDoctors(1));
    }
  }, [dispatch, query]);

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
    <div className="bg-white min-h-screen px-3 md:px-12 py-8 overflow-hidden">
      {/* Header */}
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
                disabled={loading}
                className={`ml-2 px-4 rounded-lg transition text-white 
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

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex md:hidden items-center justify-between text-[#6D7379] border-2 border-gray-300 bg-white px-4 rounded-lg w-[100px] h-14"
          >
            <div className="flex items-center gap-2">
              <VscSettings size={18} /> <span>Filter</span>
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate("/map")}
          className="hidden md:flex items-center gap-2 text-[#6D7379] border-2 border-gray-300 bg-white px-5 py-2 rounded-xl hover:bg-gray-100 transition h-14"
        >
          <MapPin size={18} /> Map
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* ===== Filter Sidebar Desktop ===== */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="hidden lg:block w-67 bg-white shadow-md border border-gray-200 p-5 rounded-xl"
            >
              <h1 className="text-lg font-semibold mb-5">Filter Options</h1>

              <div className="space-y-6 text-gray-700">
                {/* Available Date */}
                <div>
                  <h4 className="font-semibold mb-2">Available Date</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={availableDay.includes("today")}
                        onChange={() => dispatch(setAvailableDay("today"))}
                      />
                      Today
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={availableDay.includes("tomorrow")}
                        onChange={() => dispatch(setAvailableDay("tomorrow"))}
                      />
                      Tomorrow
                    </label>
                  </div>
                </div>
                {/* Gender */}
                <div>
                  <h4 className="font-semibold mb-2">Gender</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => dispatch(setGender("male"))}
                      className={`px-4 py-1 rounded-lg border font-medium transition ${
                        gender === "male"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700"
                      }`}
                    >
                      Male
                    </button>

                    <button
                      onClick={() => dispatch(setGender("female"))}
                      className={`px-4 py-1 rounded-lg border font-medium transition ${
                        gender === "female"
                          ? "bg-blue-600 text-white"
                          : "text-gray-700"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Consultation */}
                <div>
                  <h4 className="font-semibold mb-2">Consultation Type</h4>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() =>
                        dispatch(
                          setConsultation(
                            consultation === "clinic" ? null : "clinic"
                          )
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          consultation === "clinic"
                            ? "border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {consultation === "clinic" && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                        )}
                      </span>
                      In-clinic
                    </button>

                    <button
                      onClick={() =>
                        dispatch(
                          setConsultation(
                            consultation === "home" ? null : "home"
                          )
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          consultation === "home"
                            ? "border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {consultation === "home" && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                        )}
                      </span>
                      Home Visit
                    </button>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="font-semibold mb-2">Sort</h4>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        dispatch(
                          setSort(sort === "recommend" ? null : "recommend")
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          sort === "recommend"
                            ? "border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {sort === "recommend" && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                        )}
                      </span>
                      Most recommended
                    </button>

                    <button
                      onClick={() =>
                        dispatch(
                          setSort(sort === "low-high" ? null : "low-high")
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          sort === "low-high"
                            ? "border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {sort === "low-high" && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                        )}
                      </span>
                      Price Low to High
                    </button>

                    <button
                      onClick={() =>
                        dispatch(
                          setSort(sort === "high-low" ? null : "high-low")
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          sort === "high-low"
                            ? "border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {sort === "high-low" && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                        )}
                      </span>
                      Price High to Low
                    </button>
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
                className="fixed inset-0 bg-black z-50 lg:hidden"
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
                        <input
                          type="checkbox"
                          checked={availableDay.includes("today")}
                          onChange={() => dispatch(setAvailableDay("today"))}
                        />
                        Today
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={availableDay.includes("tomorrow")}
                          onChange={() => dispatch(setAvailableDay("tomorrow"))}
                        />
                        Tomorrow
                      </label>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <h4 className="font-semibold mb-2">Gender</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => dispatch(setGender("male"))}
                        className={`px-4 py-1 rounded-lg border font-medium transition ${
                          gender === "male"
                            ? "bg-blue-600 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        Male
                      </button>

                      <button
                        onClick={() => dispatch(setGender("female"))}
                        className={`px-4 py-1 rounded-lg border font-medium transition ${
                          gender === "female"
                            ? "bg-blue-600 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Consultation */}
                  <div>
                    <h4 className="font-semibold mb-2">Consultation Type</h4>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          dispatch(
                            setConsultation(
                              consultation === "clinic" ? null : "clinic"
                            )
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            consultation === "clinic"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {consultation === "clinic" && (
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                          )}
                        </span>
                        In-clinic
                      </button>

                      <button
                        onClick={() =>
                          dispatch(
                            setConsultation(
                              consultation === "home" ? null : "home"
                            )
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            consultation === "home"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {consultation === "home" && (
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                          )}
                        </span>
                        Home Visit
                      </button>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-semibold mb-2">Sort</h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            setSort(sort === "recommend" ? null : "recommend")
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            sort === "recommend"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {sort === "recommend" && (
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                          )}
                        </span>
                        Most recommended
                      </button>

                      <button
                        onClick={() =>
                          dispatch(
                            setSort(sort === "low-high" ? null : "low-high")
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            sort === "low-high"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {sort === "low-high" && (
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                          )}
                        </span>
                        Price Low to High
                      </button>

                      <button
                        onClick={() =>
                          dispatch(
                            setSort(sort === "high-low" ? null : "high-low")
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            sort === "high-low"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {sort === "high-low" && (
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                          )}
                        </span>
                        Price High to Low
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ===== Doctors List ===== */}
        <motion.div className="flex-1 min-w-0 w-full px-2 md:px-0">
          <h1 className="text-2xl font-semibold mb-6">Choose Specialties</h1>

          <SpecialtiesSlider isSidebarOpen={showFilters} />

          {loading && (
            <p className="text-center py-6 text-gray-500">Loading...</p>
          )}

          {!loading && doctorsToShow.length === 0 && (
            <p className="text-center py-8 text-lg text-gray-500">
              No doctors found.
            </p>
          )}

          {!loading && doctorsToShow.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {doctorsToShow.map((doc: any) => (
                <DoctorCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.user?.name}
                  specialty={doc.specialty?.name}
                  clinic={doc.clinic_address}
                  rating={doc.average_rating}
                  availability={doc.availability}
                  price={doc.session_price}
                  image={doc.user?.profile_photo ?? "avatar.PNG"}
                  isFavorite={favorites.includes(Number(doc.id))}
                  onToggleFavorite={toggleFavorite}
                  selectedDay={availableDay} 
                />
              ))}
            </div>
          )}
          {/* ✅ Pagination */}
          {!loading && doctorsToShow.length > 4 && (
            <div className="flex items-center mt-8 w-full">
              {/* زر Previous */}
              {+currentPage > 1 && (
                <button
                  onClick={goPrev}
                  className={`
        border border-gray-300 text-[#145DB8] px-6 py-2 rounded-lg hover:bg-gray-100
        ${currentPage === lastPage ? "mx-auto" : ""}
      `}
                >
                  Previous page
                </button>
              )}

              {/* زر Next */}
              {currentPage < lastPage && (
                <button
                  onClick={goNext}
                  className={`
        border border-gray-300 text-[#145DB8] px-10 py-2 rounded-lg hover:bg-gray-100
        ${currentPage === 1 ? "mx-auto" : "ml-auto"}
      `}
                >
                  Next Page
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorsPage;