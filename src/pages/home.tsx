import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { IoIosStar } from "react-icons/io";
import { FaApple } from "react-icons/fa";
import HeroSection from "@/components/reusable/HeroSection";
import HowItWorksSection from "@/components/reusable/HowItWorksSection";
import TopDoctorsSlider from "@/components/reusable/TopDoctorsSlider";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const faqs = [
  {
    q: "What is this app used for?",
    a: "Find and book doctors, manage appointments and view your history.",
  },
  {
    q: "Is the app free to use?",
    a: "Yes — basic search and booking features are free. Clinic fees still apply.",
  },
  {
    q: "How can I find a doctor?",
    a: "Use the search or filter by specialty, location, or ratings.",
  },
  {
    q: "Can I cancel my appointment?",
    a: "Yes — from your bookings page; cancellation policy may vary by clinic.",
  },
  {
    q: "What payment are supported?",
    a: "Card payments, mobile wallets and cash at clinic (where supported).",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const user= useSelector((state: any) => state.auth.user);
  useEffect(() => {
    if (!user) {
      navigate("/signin"); 
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen px-2 md:px-12 bg-white text-gray-800">
      <HeroSection />
      <HowItWorksSection />

      {/* MAP + CTA */}
      <section className="py-10">
        <div className="w-full mx-auto flex flex-col items-center text-center lg:text-left lg:flex-row gap-10 lg:items-center">
          <div className="flex-1 flex flex-col items-center lg:items-start">
            <h1 className="text-2xl md:text-5xl mb-4 font-semibold">
              Find Care Near You in Seconds
            </h1>

            <p className="text-gray-600 text-sm md:text-xl mb-6 max-w-md lg:max-w-2xl">
              Allow location access or choose your city to instantly discover
              trusted doctors and clinics around you—quick, easy, and local.
            </p>

            <button
              onClick={() => navigate("doctors")}
              className="flex items-center gap-2 border border-primary-500 text-primary-500 px-5 py-3 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
            >
              <FiMapPin /> <span>Search by location</span>
            </button>
          </div>

          <img
            src="map_img.png"
            alt="map"
            className="w-full max-w-sm md:max-w-md object-cover"
          />
        </div>
      </section>

      <TopDoctorsSlider />

      {/* REVIEWS */}
      <section className="py-12">
        <div className="w-full mx-auto flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-5xl mb-3 leading-tight">
            Reviews
            <p>That Speak for Themselves</p>
          </h1>

          <div className="flex items-center justify-center gap-1 text-xl md:text-2xl text-yellow-400 my-6">
            <IoIosStar /> <IoIosStar /> <IoIosStar /> <IoIosStar />{" "}
            <IoIosStar />
          </div>

          <p className="text-gray-600 italic max-w-sm md:max-w-[500px] text-center mb-12">
            “Quick and easy booking! I found a great dermatologist near me and
            booked an appointment in just a few minutes.”
          </p>

          <div className="items-center justify-center -space-x-3 mb-4 grid grid-cols-3 md:grid-cols-5 ">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="relative md:top-8 md:left-8 md:w-24 md:h-24 rounded-full border-2 border-white"
              alt="u1"
            />
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="md:w-28 md:h-28 rounded-full border-2 border-white"
              alt="u2"
            />
            <img
              src="https://randomuser.me/api/portraits/men/52.jpg"
              className="md:w-36 md:h-36 rounded-full border-2 border-white"
              alt="u3"
            />
            <img
              src="https://randomuser.me/api/portraits/women/22.jpg"
              className="hidden md:flex md:w-28 md:h-28 relative md:top-2 md:left-5 rounded-full border-2 border-white"
              alt="u4"
            />
            <img
              src="https://randomuser.me/api/portraits/men/12.jpg"
              className="hidden md:flex relative left-2 md:top-8 md:w-24 md:h-24 rounded-full border-2 border-white"
              alt="u5"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Tag */}
          <div className="bg-primary-50 px-5 py-2 rounded-full shadow text-xs sm:text-sm font-medium text-primary-400">
            Frequently Asked Questions
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-center leading-tight">
            Got Questions? We've got Answers!
          </h1>

          {/* FAQ Container */}
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {faqs.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border border-gray-200 transition-all overflow-hidden ${
                    isOpen ? "bg-gray-100" : "bg-gray-50"
                  }`}
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 text-left text-base sm:text-lg font-semibold text-gray-900"
                  >
                    <span>{f.q}</span>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-gray-900" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-900" />
                    )}
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      >
                        <div className="px-4 sm:px-6 py-5 text-gray-600 text-sm sm:text-base border-t border-gray-200 leading-relaxed">
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP CTA */}
<section className="relative mt-20 px-4">
  <div
    className="relative z-20 w-full mx-auto bg-[#6292CF] text-white rounded-2xl 
        p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 shadow-xl
        lg:-mb-29"
  >
    {/* TEXT */}
    <div className="flex-1 text-center lg:text-left">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
        Your Health, One Tap Away
      </h1>

      <p className="mt-3 text-white/90 text-sm sm:text-base md:text-lg max-w-md mx-auto lg:mx-0">
        Book appointments, chat with doctors, and manage your health anytime—
        right from your phone. Download the app now and stay connected wherever you are.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 flex-wrap">
        <button className="hover:bg-white hover:text-black transition-all flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg">
          <img src="logos_google-play-icon.png" alt="icon" className="w-6" />
          <Link to="https://play.google.com/store/games" target="_blank" className="flex flex-col leading-tight">
            <span className="text-[10px] text-gray-300">GET IT ON</span>
            <span className="text-lg font-medium">Google Play</span>
          </Link>
        </button>

        <button className="hover:bg-white hover:text-black transition-all flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg">
          <FaApple className="w-7 h-7" />
          <Link to="https://www.apple.com/eg-ar/app-store/" target="_blank" className="flex flex-col leading-tight">
            <span className="text-[10px] text-gray-300">Download on the</span>
            <span className="text-lg font-medium">App Store</span>
          </Link>
        </button>
      </div>
    </div>

    {/* IMAGE */}
    <div className="w-full lg:w-1/3 flex justify-center">
      <img src="down.png" alt="app" className="w-[260px] sm:w-[330px] md:w-[380px] lg:w-full" />
    </div>
  </div>
</section>

    </div>
  );
};

export default Home;
