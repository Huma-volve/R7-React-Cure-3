import { FiSearch } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { FaApplePay, FaPaypal, FaCcVisa } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Autoplay } from "swiper/modules";

const HowItWorksSection: React.FC = () => {
  const words = ["doctor name", "specialty", "location"];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setAnimate(false);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-8 bg-white">
      <div>
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
            0: { slidesPerView: 1 },
          }}
          speed={600}
          loop
          style={{ paddingBottom: "40px" }} // ينزل النقاط تحت شوية
        >
          <SwiperSlide>
            {/* ===== Card 1 ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="md:px-6 pt-3">
            {/* الصورة العلوية */}
            <img src="1.png" alt="top" />

            {/* الديف بتاع السيرش */}
            <div className="flex justify-center items-center w-full">
              <div className="bg-white border border-primary-300 my-2 rounded-xl px-4 py-2 w-full flex items-center gap-2 shadow-sm overflow-hidden relative h-[45px]">
                <FiSearch />
                <span>Search by</span>

                {/* الكلمة المتغيرة */}
                <div className="relative h-[24px] overflow-hidden w-[120px]">
                  <span
                    className={`absolute left-0 transition-all duration-500 ease-in-out ${
                      animate
                        ? "-translate-y-full opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    key={index}
                  >
                    {words[index]}
                  </span>
                </div>
              </div>
            </div>
          </div>


          <img className="px-6 mt-1" src="2.png" alt="bottom" />

          <div className="px-4 mt-3 w-full text-left shadow-[0_-4px_10px_rgba(0,0,0,0.06)] pt-2 pb-2 rounded-b-2xl">
            <h1 className="text-lg font-semibold text-gray-900">
              Search for a Doctor
            </h1>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              Easily browse by specialty, location, or doctor name to find the
              right healthcare provider for your needs.
            </p>
          </div>
        </div>
          </SwiperSlide>

          <SwiperSlide>
            {/* ===== Card 2 ===== */}
        <div className="bg-white rounded-2xl shadow-sm border z-10 border-gray-100 flex flex-col items-center text-center">
          <div className="bg-white border border-b-0 pt-8 border-gray-200 mt-6 rounded-2xl p-4 shadow-sm w-full h-[150px] max-w-[330px]">
            <div className="flex justify-between items-center mb-2">
              <BsArrowRight className="rotate-180 text-gray-500" />
              <span className="font-semibold text-gray-700 text-xl">
                July 2025
              </span>
              <BsArrowRight className="text-gray-500" />
            </div>
            <div className="grid grid-cols-7 text-center text-gray-500 mb-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 text-center gap-2 text-gray-700">
              <span className="bg-gray-100 font-semibold rounded-lg py-[2px] shadow-sm">7</span>
              <span className="bg-gray-100 font-semibold rounded-lg py-[2px] shadow-sm">9</span>
              <span className="bg-gray-100 font-semibold rounded-lg py-[2px] shadow-sm">11</span>
              <span className="bg-gray-100 font-semibold rounded-lg py-[2px] shadow-sm">12</span>
              <span className="bg-gray-100 font-semibold rounded-lg py-[2px] shadow-sm">13</span>
              <span className="bg-gray-100 font-semibold rounded-lg py-[2px] shadow-sm">15</span>
              <span className="bg-blue-100 text-blue-600 font-semibold rounded-lg py-[2px] shadow-sm">
                17
              </span>
            </div>
          </div>

          <div className="px-4 w-full text-left shadow-[0_-4px_10px_rgba(0,0,0,0.06)] pt-2 pb-2 rounded-b-2xl">
            <h1 className="text-lg font-semibold text-gray-900">
              Choose a Date & Time
            </h1>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              View real-time availability and pick a slot that works best for
              your schedule.
            </p>
          </div>
        </div>
          </SwiperSlide>

          <SwiperSlide>
            {/* ===== Card 3 ===== */}
         <div className="bg-white rounded-2xl shadow-sm border z-10 border-gray-100 flex flex-col items-center text-center">
          <div className="flex flex-col gap-3 w-full mb-4 mt-6 max-w-[250px]">
              <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm flex items-center gap-2">
                <FaApplePay className="text-gray-800 text-lg" />{" "}
                <span className="text-sm text-gray-600">
                  Quick checkout with Apple
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg relative right-7 p-2 shadow-sm flex items-center gap-2">
                <FaCcVisa className="text-blue-600 text-lg" />{" "}
                <span className="text-sm text-gray-600">
                  Secure card payments
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm flex items-center gap-2">
                <FaPaypal className="text-blue-500 text-lg" />{" "}
                <span className="text-sm text-gray-600">Easy via PayPal</span>
              </div>
            </div>

          <div className="px-4 w-full text-left shadow-[0_-4px_10px_rgba(0,0,0,0.06)] pb-2 rounded-b-2xl">
            <div className="mt-2">
              <h1 className="text-lg font-semibold text-gray-900">
                Book & Pay Online
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Confirm your appointment and pay securely using your preferred
                payment method.
              </p>
            </div>
          </div>
        </div>
          </SwiperSlide>
        </Swiper>
      </div>

    </section>
  );
};

export default HowItWorksSection;
