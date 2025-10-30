import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { VscSettings } from "react-icons/vsc";
import { IoChevronDownSharp } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router";
import SpecialtiesSlider from "@/components/reusable/SpecialtiesSlider";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  time: string;
  price: number;
  image: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Sarah Adams",
    specialty: "Dentist",
    clinic: "Cairo Clinic",
    rating: 4.6,
    time: "10:00am - 6:00pm",
    price: 300,
    image: "./doctor.jpg",
  },
  {
    id: 2,
    name: "Omar Khaled",
    specialty: "Cardiologist",
    clinic: "HeartCare Center",
    rating: 4.9,
    time: "9:00am - 5:00pm",
    price: 400,
    image: "./doctor.jpg",
  },
  {
    id: 3,
    name: "Lina Hassan",
    specialty: "Dermatologist",
    clinic: "SkinHealth Clinic",
    rating: 4.8,
    time: "11:00am - 7:00pm",
    price: 250,
    image: "./doctor.jpg",
  },
  {
    id: 4,
    name: "Ahmed Tarek",
    specialty: "Neurologist",
    clinic: "BrainCare Hospital",
    rating: 4.7,
    time: "8:00am - 4:00pm",
    price: 350,
    image: "./doctor.jpg",
  },
  {
    id: 5,
    name: "Ahmed Tarek",
    specialty: "Neurologist",
    clinic: "BrainCare Hospital",
    rating: 4.7,
    time: "8:00am - 4:00pm",
    price: 350,
    image: "./doctor.jpg",
  },
  {
    id: 6,
    name: "Ahmed Tarek",
    specialty: "Neurologist",
    clinic: "BrainCare Hospital",
    rating: 4.7,
    time: "8:00am - 4:00pm",
    price: 350,
    image: "./doctor.jpg",
  },
  {
    id: 7,
    name: "Ahmed Tarek",
    specialty: "Neurologist",
    clinic: "BrainCare Hospital",
    rating: 4.7,
    time: "8:00am - 4:00pm",
    price: 350,
    image: "./doctor.jpg",
  },
  {
    id: 8,
    name: "Ahmed Tarek",
    specialty: "Neurologist",
    clinic: "BrainCare Hospital",
    rating: 4.7,
    time: "8:00am - 4:00pm",
    price: 350,
    image: "./doctor.jpg",
  },
  {
    id: 9,
    name: "Ahmed Tarek",
    specialty: "Neurologist",
    clinic: "BrainCare Hospital",
    rating: 4.7,
    time: "8:00am - 4:00pm",
    price: 350,
    image: "./doctor.jpg",
  },
];

const DoctorsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");
  const navigate =useNavigate()

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white min-h-screen md:px-16 py-8 overflow-hidden">
      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Filter button - hidden on small screens */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="hidden md:flex items-center justify-between text-[#6D7379] border-2 border-gray-300 bg-white px-4 rounded-lg w-36 h-14"
        >
          <div className="flex items-center gap-2">
            <VscSettings size={18} />
            <span>Filter</span>
          </div>
          <div className="w-[1.5px] h-full bg-[#ced5d4] mx-2"></div>
          <IoChevronDownSharp size={16} className="text-[#6D7379]" />
        </button>

        {/* Search input */}
        <div className="flex-1 flex justify-center border-2 border-gray-300 py-1 pr-1 pl-4 rounded-lg h-14 w-full">
          <input
            type="text"
            placeholder="Search doctors"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-transparent w-full outline-none text-xl"
          />
          {searchText && (
            <button className="ml-2 bg-[#145DB8] text-white px-4 rounded-lg hover:bg-blue-700 transition">
              Search
            </button>
          )}
        </div>

        {/* Map button - hidden on small screens */}
        <button className="hidden md:flex items-center gap-2 text-[#6D7379] border-2 border-gray-300 bg-white px-5 py-2 rounded-xl hover:bg-gray-100 transition h-14">
          <MapPin size={18} /> Map
        </button>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Sidebar (Filter) */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="hidden lg:block w-72 bg-white shadow-md border border-gray-200 p-5 rounded-xl h-[calc(100vh-200px)] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-5">Filter Options</h3>

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

        {/* Doctors List */}
        <motion.div
          animate={{ x: showFilters ? 20 : 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-1 min-w-0 w-full"
        >
          <h2 className="text-2xl font-semibold mb-6">Choose Specialties</h2>

          <SpecialtiesSlider isSidebarOpen={showFilters} />

          {/* ✅ Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`${doc.id}`)}
                className="relative border cursor-pointer border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
              >
                {/* ❤️ أيقونة المفضلة */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    toggleFavorite(doc.id)}}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                >
                  {favorites.includes(doc.id) ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-2xl" />
                  )}
                </button>

                {/* 👩‍⚕️ صورة ومعلومات الطبيب */}
                <div className="flex items-start gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-[18px] mb-1">
                        {doc.name}
                      </h3>
                      <p className="text-gray-600 text-[15px] mb-1">
                        {doc.specialty} | {doc.clinic}
                      </p>
                    </div>
                    <div className="text-[15px] text-gray-700 flex gap-2 items-center">
                      <IoIosStar className="text-[#f0f80b] text-xl" />
                      <span>
                        {doc.rating} • {doc.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 💵 السعر */}
                <div className="text-gray-600 text-[17px] leading-tight mt-2 flex justify-between">
                  <span>Price/hour</span>
                  <span className="text-red-500 font-semibold">
                    ${doc.price}
                  </span>
                </div>

                {/* 📅 الزرار */}
                <button className="bg-[#145DB8] text-white px-5 py-2 h-12 rounded-lg hover:bg-blue-700 mt-4"
                 onClick={(e)=>{
                  e.stopPropagation(); 
                  navigate('booking')}}>
                  Book appointment
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-between">
            <button className="border border-gray-300 text-[#145DB8] px-6 py-2 rounded-lg hover:bg-gray-100">
              Previous page
            </button>
            <button className="border border-gray-300 text-[#145DB8] px-6 py-2 rounded-lg hover:bg-gray-100">
              Next Page
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorsPage;
