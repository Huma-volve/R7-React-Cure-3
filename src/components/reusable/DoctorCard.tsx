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
  time: string;
  price: number;
  image: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  showBookingButton?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  specialty,
  clinic,
  rating,
  time,
  price,
  image,
  isFavorite,
  onToggleFavorite,
  showBookingButton = true,
}) => {
  const navigate = useNavigate();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  // Sync لما Redux يتغير (لو الصفحة اتعملها Refresh)
  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <div 
      onClick={()=>navigate(`/doctor/${id}`)}
      className="relative border cursor-pointer border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setLocalFavorite((prev) => !prev); // ✅ قلب القيمه محلياً فوراً
          onToggleFavorite(id); // بعد كده ابعتيه للـ Redux والـ API
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
              {rating} • {time}
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
