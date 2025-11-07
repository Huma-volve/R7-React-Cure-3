import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
} from "react-icons/fa";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center text-center py-12 relative">
      {/* ========= الصور المتراكبة + المحتوى ========= */}
      <div className="relative w-full max-w-5xl h-[500px] flex justify-center items-center">
        {/* ===== الصور ===== */}
        <img
          src="bg1.png"
          alt="1"
          className="hidden md:flex absolute object-cover top-[-35px]"
        />
        <img
          src="bg2.png"
          alt="2"
          className="hidden md:flex absolute object-cover top-[-30px] w-2xl"
        />
        <img src="bg3.png" alt="3" className="hidden md:flex absolute object-cover" />

        {/* ===== النصوص والعناصر اللي فوق الصور ===== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 px-4">
          {/* Upgrade */}
          <div className="absolute top-[-10px] md:top-6 bg-primary-50 px-4 py-2 rounded-full shadow text-sm font-medium text-gray-700 flex items-center gap-2">
            <img src="star.png" alt="star"/> Upgrade your account
          </div>

          {/* العنوان */}
          <h1 className="relative text-xl sm:text-2xl w-96 md:w-full md:text-3xl text-gray-900 leading-tight bottom-6">
            Find and book top doctors near you
          </h1>

          {/* الوصف */}
          <p className="mt-4 text-gray-600 max-w-xl mx-auto relative bottom-5">
            Easily find top-rated specialists near you and book appointments in
            just a few clicks. Whether you need an in-person visit consultation,
            we're here to connect you with the right care—fast, simple, and
            secure.
          </p>

          {/* شارة المرضى */}
          <div className="mt-4 bg-white rounded-full px-5 py-2 shadow text-gray-700 text-sm flex items-center gap-3">
            {/* الصور الثلاث */}
            <div className="flex -space-x-3">
              <img
                src="profile.png"
                alt="img1"
                className="w-8 h-8 rounded-full border-2 border-white z-10"
              />
              <img
                src="profile.png"
                alt="img2"
                className="w-8 h-8 rounded-full border-2 border-white z-20"
              />
              <img
                src="profile.png"
                alt="img3"
                className="w-8 h-8 rounded-full border-2 border-white z-30"
              />
            </div>

            <span>10k+ happy patients</span>
          </div>

          {/* الأزرار */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/doctors")}
              className="bg-[#145DB8] text-white px-3 py-2 md:px-6 md:py-2 rounded-lg shadow hover:bg-white hover:text-primary-400 transition"
            >
              Get started
            </button>
            <button
              onClick={() => navigate(`/doctors`)}
              className="border border-primary-400 px-5 py-2 rounded-lg text-primary-400 hover:bg-[#145DB8] hover:text-white  transition flex items-center gap-2"
            >
              <FiSearch /> Book Appointment
            </button>
          </div>

          <div className="hidden md:flex absolute left-10 top-1/3 flex-col items-center">
           
            <FaMapMarkerAlt className="text-[#145DB8] text-2xl mb-2" />
            <div className="w-40 px-4 bg-gray-100 py-2 rounded-full shadow flex items-center justify-center text-gray-700 text-sm">
              Doctors near you
            </div>
          </div>

          {/* ✅ Book Now مع الأيقونة فوقها */}
          <div className="hidden md:flex absolute right-10 top-2/3 flex-col items-center gap-2">
            {/* الأيقونة */}
            <img src='location_icon.png' alt="icon" className="relative right-[67px] top-[15px] rotate-[22deg]"/>
            {/* الديف */}
            <div className="bg-gray-100 px-4 py-2 rounded-full shadow rotate-[35deg] flex items-center gap-2">
              Book Now
            </div>
          </div>

          <div className="relative top-40 text-3xl font-semibold text-gray-800 flex items-center gap-2">
             How it works
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
