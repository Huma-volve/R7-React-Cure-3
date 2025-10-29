import React from "react";
import { Heart, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface FavoriteItem {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  time: string;
}

const favorites: FavoriteItem[] = [
  {
    id: 1,
    name: "Robert Johnson",
    specialty: "Orthopedic",
    hospital: "El-Nasr Hospital",
    rating: 4.8,
    time: "9:30am - 8:00pm",
  },
  {
    id: 2,
    name: "Sarah Miller",
    specialty: "Cardiologist",
    hospital: "Cairo Heart Center",
    rating: 4.9,
    time: "10:00am - 6:00pm",
  },
  {
    id: 3,
    name: "John Smith",
    specialty: "Dentist",
    hospital: "Smiles Clinic",
    rating: 4.7,
    time: "8:00am - 4:00pm",
  },
  {
    id: 3,
    name: "John Smith",
    specialty: "Dentist",
    hospital: "Smiles Clinic",
    rating: 4.7,
    time: "8:00am - 4:00pm",
  }, 
  {
    id: 3,
    name: "John Smith",
    specialty: "Dentist",
    hospital: "Smiles Clinic",
    rating: 4.7,
    time: "8:00am - 4:00pm",
  },
  {
    id: 3,
    name: "John Smith",
    specialty: "Dentist",
    hospital: "Smiles Clinic",
    rating: 4.7,
    time: "8:00am - 4:00pm",
  },
];

const FavoritePage: React.FC = () => {
  const navigate =useNavigate()
  const hasFavorites = favorites.length > 0;

  return (
    <div className="min-h-scree md:px-0 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Your Favorites
        </h1>
        <button className="text-gray-600 hover:text-gray-900 transition"
         onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Empty State */}
      {!hasFavorites && (
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

      {/* Favorites List */}
      {hasFavorites && (
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {item.specialty} | {item.hospital}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" /> {item.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {item.time}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button className="text-red-500 hover:scale-110 transition-transform">
                  <Heart fill="currentColor" className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
