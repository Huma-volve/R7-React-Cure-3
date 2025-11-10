import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  price: number;
  image: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  availability?: any; 
  showBookingButton?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  specialty,
  clinic,
  rating,
  price,
  image,
  isFavorite,
  onToggleFavorite,
  availability,
  showBookingButton = true,
}) => {
  const navigate = useNavigate();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalFavorite(isFavorite);
    console.log(localFavorite)
  }, [isFavorite]);

  // ✅ دالة لحساب الوقت المتاح داخل الكارد
 const getAvailableTime = (availability: any) => {
  if (!availability || Object.keys(availability).length === 0) return "غير متاح هذا الاسبوع";

  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];
  const tomorrowName = days[(todayIndex + 1) % 7];

  const todaySlots = availability[todayName];
  const tomorrowSlots = availability[tomorrowName];

  // 1️⃣ اليوم
  if (todaySlots && todaySlots.length > 0) {
    return `${todayName.charAt(0).toUpperCase() + todayName.slice(1)} ${todaySlots[0]}-${todaySlots[todaySlots.length - 1]}`;
  } 

  // 2️⃣ بكرة
  if (tomorrowSlots && tomorrowSlots.length > 0) {
    return `${tomorrowName.charAt(0).toUpperCase() + tomorrowName.slice(1)} ${tomorrowSlots[0]}-${tomorrowSlots[tomorrowSlots.length - 1]}`;
  }

  // 3️⃣ لو اليوم وبكرة فاضيين → نلف على باقي الأسبوع
  for (let i = 2; i < 7; i++) {
    const dayName = days[(todayIndex + i) % 7];
    const slots = availability[dayName];
    if (slots && slots.length > 0) {
      return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${slots[0]}-${slots[slots.length - 1]}`;
    }
  }

  return "غير متاح هذا الاسبوع";
};


  const availableTime = getAvailableTime(availability); // ✅ استخدام الدالة داخليًا

  return (
    <div 
      onClick={()=>navigate(`/doctor/${id}`)}
      className="relative border cursor-pointer border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLocalFavorite((prev) => !prev);
          onToggleFavorite(id);
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
      >
        {localFavorite ? (
          <AiFillHeart className="text-red-500 text-2xl" />
        ) : (
          <AiOutlineHeart className="text-2xl" />
        )}
      </button>

      <div className="flex items-start gap-4">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between">
          <h1 className="font-semibold text-gray-900 text-[18px] mb-1">
            {name}
          </h1>
          <p className="text-gray-600 text-[15px] mb-1">
            {specialty} | {clinic}
          </p>
          <div className="text-[15px] text-gray-700 flex gap-2 items-center">
            <IoIosStar className="text-[#f0f80b] text-xl" />
            <span>
              {rating} • {availableTime} {/* ✅ استخدم الوقت المحسوب داخليًا */}
            </span>
          </div>
        </div>
      </div>

      <div className="text-gray-600 text-[17px] leading-tight mt-2 flex justify-between">
        <span>Price/hour</span>
        <span className="text-red-500 font-semibold">${price}</span>
      </div>

      {showBookingButton && (
        <button
          className="bg-[#145DB8] text-white px-5 py-2 h-12 rounded-lg hover:bg-blue-700 mt-4"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/doctor/${id}`);
          }}
        >
          Book appointment
        </button>
      )}
    </div>
  );
};

export default DoctorCard;
