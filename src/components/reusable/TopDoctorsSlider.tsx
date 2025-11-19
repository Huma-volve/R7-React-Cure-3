import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DoctorCard from "./DoctorCard";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchAllDoctors } from "@/redux/searchSlice";
import {
  checkFavoriteStatus,
  toggleFavoriteOnServer,
} from "@/redux/favoritesSlice";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TopDoctorsSlider: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const doctors = useSelector((state: RootState) => state.search.originalData);
  const favorites = useSelector((state: RootState) => state.favorites.list);
   const [api, setApi] = useState<any>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const topDoctors = [...safeDoctors]
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 5);

  const toggleFavorite = (id: number) => {
    dispatch(toggleFavoriteOnServer(id));
  };
  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };

    updateButtons();
    api.on("select", updateButtons);
  }, [api]);
  // تحميل الدكاترة
  useEffect(() => {
    dispatch(fetchAllDoctors(1));
  }, [dispatch]);

  // تحديث حالة الـ Favorite
  useEffect(() => {
    topDoctors.forEach((doc: any) => {
      const isFavorite = favorites.includes(doc.id);
      if (isFavorite) dispatch(checkFavoriteStatus(Number(doc.id)));
    });
  }, [topDoctors, dispatch, favorites]);

  return (
    <section className="py-10 bg-white">
      <div className="w-full mx-auto">
        {/* --- عنوان --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold">
              Top-Rated Doctors Chosen by Patients
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-[550px] mx-auto md:mx-0">
              Explore our highest-rated doctors, trusted by real patients.
            </p>
          </div>

          <button
            onClick={() => navigate("doctors")}
            className="text-[#145DB8] border hover:bg-[#145DB8] hover:text-white border-[#145DB8] px-4 py-3 rounded-lg"
          >
            View all
          </button>
        </div>

        {/* --- السلايدر --- */}
        {safeDoctors.length === 0 ? (
          <p className="text-center text-gray-500">No doctors found.</p>
        ) : (
          <div className="relative">
            <Carousel
              opts={{ align: "start", loop: false }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent>
                {topDoctors.map((doc) => (
                  <CarouselItem
                    key={doc.id}
                    className="
                      px-2 
                      basis-[100%] 
                      sm:basis-[50%] 
                      lg:basis-[33.33%] 
                      xl:basis-[25%]
                    "
                  >
                    <DoctorCard
                      id={doc.id}
                      name={doc.user?.name}
                      specialty={doc.specialty?.name}
                      clinic={doc.clinic_address}
                      rating={doc.average_rating}
                      availability={doc.availability}
                      price={doc.session_price}
                      image={doc.user?.profile_photo ?? 'avatar.PNG'}
                      isFavorite={favorites.includes(doc.id)}
                      onToggleFavorite={() => toggleFavorite(doc.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

            {/* السهم الشمال */}
      {canPrev && (
        <CarouselPrevious className="left-2 custom-arrow" />
      )}

      {/* السهم اليمين */}
      {canNext && (
        <CarouselNext className="right-2 custom-arrow" />
      )}</Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDoctorsSlider;
