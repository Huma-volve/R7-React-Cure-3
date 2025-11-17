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
  selectedDay?: string[];
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
  selectedDay = [],
  showBookingButton = true,
}) => {
  const navigate = useNavigate();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  // ✅ دالة لحساب الوقت المتاح داخل الكارد
 const getAvailableTime = (availability: any, selectedDay: string[]) => {
  if (!availability || Object.keys(availability).length === 0)
    return "Not available";

  const days = [
    "sunday", "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday"
  ];

  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];
  const tomorrowName = days[(todayIndex + 1) % 7];

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formatSlots = (slotsObj: any, dayName: string) => {
    const times = Object.keys(slotsObj);
    if (times.length === 0) return null;
    const start = times[0];
    const end = slotsObj[start];
    return `${capitalize(dayName)} ${start}-${end}`;
  };

  // 🔵 1) لو المستخدم اختار Today فقط
  if (selectedDay.includes("today")) {
    const slots = availability[todayName];
    const formatted = slots ? formatSlots(slots, todayName) : null;
    return formatted ?? "Not available today";
  }

  // 🔵 2) لو المختار Tomorrow فقط
  if (selectedDay.includes("tomorrow")) {
    const slots = availability[tomorrowName];
    const formatted = slots ? formatSlots(slots, tomorrowName) : null;
    return formatted ?? "Not available tomorrow";
  }

  // 🟢 3) ديفولت: لو لا Today ولا Tomorrow متعلم
  //    → يعرض وقت النهاردة
  const todaySlots = availability[todayName];
  const todayFormatted = todaySlots
    ? formatSlots(todaySlots, todayName)
    : null;

  if (todayFormatted) return todayFormatted;

  // 🟡 4) لو النهاردة مفيش → دور على أول يوم متاح بعده
  for (let i = 1; i < 7; i++) {
    const dayName = days[(todayIndex + i) % 7];
    const slots = availability[dayName];
    if (slots) {
      const formatted = formatSlots(slots, dayName);
      if (formatted) return formatted;
    }
  }

  return "Not available this week";
};



  const availableTime = getAvailableTime(availability, selectedDay);

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
