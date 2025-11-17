import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";
import DoctorCard from "@/components/reusable/DoctorCard";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

const FavoritePage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        "https://round7-cure.huma-volve.com/api/favorites",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const rawData = response.data?.data?.favorites || [];
      
      setFavorites(rawData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    }
  };

  const toggleFavorite = (doctorId: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== doctorId));

    axios
      .post(
        `https://round7-cure.huma-volve.com/api/favorites/toggle/${doctorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch(() => {
        fetchFavorites();
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const hasFavorites = favorites.length > 0;

  return (
    <div className="min-h-screen px-3 md:px-14 py-10">
      <div className="w-full mx-auto flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Your Favorites
        </h1>
        <button
          className="text-gray-600 hover:text-gray-900 transition"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* 💨 Skeleton Loading */}
      {loading && (
        <div className="w-full mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-2xl p-6 h-64 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                  <div className="h-3 bg-gray-300 rounded w-2/3" />
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mt-6" />
            </div>
          ))}
        </div>
      )}

      {/* 🩶 Empty */}
      {!loading && !hasFavorites && (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <div className="relative">
            <Heart className="w-24 h-24 text-red-400" />
            <div className="absolute w-6 h-6 bg-red-100 rounded-full top-6 left-10 animate-ping" />
            <div className="absolute w-5 h-5 bg-red-100 rounded-full bottom-4 right-8 animate-ping" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            Your favorite list is empty
          </h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Add doctors to your favorites to find them quickly next time.
          </p>
        </div>
      )}

      {!loading && hasFavorites && (
        <div className="w-full mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((doc) => (
            <DoctorCard
              key={doc.id}
              id={doc.id}
              name={doc.user?.name || "Unknown Doctor"}
              specialty={doc.specialty?.name || "Unknown Specialty"}
              clinic={doc.clinic_address || "Not specified"}
              rating={doc.average_rating || 0}
              availability={doc.availability}
              price={Number(doc.session_price) || 0}
              image={
                doc.user?.profile_photo && doc.user.profile_photo !== "null"
                  ? doc.user.profile_photo
                  : "avatar.PNG"
              }
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              showBookingButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
