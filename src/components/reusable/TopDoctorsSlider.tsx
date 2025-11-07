import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DoctorCard from "./DoctorCard";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchAllDoctors } from "@/redux/searchSlice";

const TopDoctorsSlider: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [favorites, setFavorites] = useState<number[]>([]);
  const doctors = useSelector((state: RootState) => state.search.originalData);

  const topDoctors = [...doctors]
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 4);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  return (
    <section className="py-10 bg-white">
      <div className="w-full mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold leading-tight">
              Top-Rated Doctors Chosen by Patients
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-[550px] mx-auto md:mx-0">
              Explore our highest-rated doctors, trusted by real patients for their expertise, care, and service. Book with confidence today.
            </p>
          </div>

          <button
            onClick={() => navigate("doctors")}
            className="text-[#145DB8] border hover:bg-[#145DB8] hover:text-white border-[#145DB8] px-4 py-3 rounded-lg self-center md:self-auto"
          >
            View all
          </button>
        </div>

        {/* Slider */}
        <Swiper
          spaceBetween={24}
          grabCursor={true}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 1.3 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1400: { slidesPerView: 3.5 },
          }}
          className="py-4"
        >
          {topDoctors.map((doc) => (
            <SwiperSlide key={doc.id}>
              <DoctorCard
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TopDoctorsSlider;
