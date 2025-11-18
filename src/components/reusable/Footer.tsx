import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { TiSocialFacebook } from "react-icons/ti";
import { FaYoutube } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { TfiLinkedin } from "react-icons/tfi";
import { FaWhatsapp } from "react-icons/fa";
const Footer: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpen(open === i ? null : i);
  };
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 bg-[#021024] text-white pt-30 lg:pt-40 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Column 1 */}
        <div className="col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <img src="logo_footer.png" />
          </div>

          <h1 className="text-white text-lg leading-relaxed max-w-xs md:max-w-sm">
            Cure helps you find trusted doctors, book appointments, and manage
            your health—quickly and easily.
          </h1>

          <div className="flex gap-3 mt-4 justify-end md:justify-start">
            <Link to="https://facebook.com/" target="_blank">
              <div className="w-8 h-8 rounded-full border border-white flex justify-center items-center hover:bg-white hover:text-black transition">
                <TiSocialFacebook size={22} />
              </div>
            </Link>

            <Link to="https://youtube.com/" target="_blank">
              <div className="w-8 h-8 rounded-full border border-white flex justify-center items-center hover:bg-white hover:text-black transition">
                <FaYoutube />
              </div>
            </Link>

            <Link to="https://www.linkedin.com/" target="_blank">
              <div className="w-8 h-8 rounded-full border border-white flex justify-center items-center hover:bg-white hover:text-black transition">
                <TfiLinkedin />
              </div>
            </Link>

            <Link to="https://web.whatsapp.com/" target="_blank">
              <div className="w-8 h-8 rounded-full border border-white flex justify-center items-center hover:bg-white hover:text-black transition">
                <FaWhatsapp size={20} />
              </div>
            </Link>
          </div>
        </div>

        {/* --- الأقسام التي ستصبح DropDown في الموبايل --- */}
        <div className="col-span-3 flex flex-col md:flex-row md:justify-center gap-3 md:text-left text-left">
          {/* Company */}
          <div className="w-full">
            {/* موبايل - العنوان + علامة */}
            <button
              onClick={() => toggle(1)}
              className="md:hidden w-full flex justify-between hover:text-gray-400 items-center py-3 text-lg font-medium"
            >
              <span>Company</span>
              {open === 1 ? <Minus size={20} /> : <Plus size={20} />}
            </button>

            {/* ديسكتوب - عنوان ثابت */}
            <h1 className="hidden md:block text-2xl mb-4">Company</h1>

            {/* موبايل - يظهر فقط لما يضغط */}
            <AnimatePresence initial={false}>
              {open === 1 && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2 text-gray-300 pl-4 md:hidden"
                >
                  <li onClick={() => navigate("/")}>Home</li>
                  <li onClick={() => navigate("/doctors")}>Doctors</li>
                  <li onClick={() => navigate("/profile-setting")}>FAQs</li>
                  <li onClick={() => navigate("/chat")}>Contact Us</li>
                </motion.ul>
              )}
            </AnimatePresence>

            {/* ديسكتوب - ثابت */}
            <ul className="hidden md:block space-y-2 text-gray-300">
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/doctors")}>Doctors</li>
              <li onClick={() => navigate("/profile-setting")}>FAQs</li>
              <li onClick={() => navigate("/chat")}>Contact Us</li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-full">
            <button
              onClick={() => toggle(2)}
              className="md:hidden w-full flex justify-between hover:text-gray-400 items-center py-3 text-lg font-medium"
            >
              <span>Support</span>
              {open === 2 ? <Minus size={20} /> : <Plus size={20} />}
            </button>

            <h1 className="hidden md:block text-2xl mb-4">Support</h1>

            <AnimatePresence initial={false}>
              {open === 2 && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2 text-gray-300 pl-4 md:hidden"
                >
                  <li onClick={() => navigate("/chat")}>Help Center</li>
                  <li
                    onClick={() => {
                      const section = document.getElementById("how-it-works");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    How it works
                  </li>
                  <li onClick={() => navigate("/profile-setting")}>
                    Privacy Policy
                  </li>
                  <li onClick={() => navigate("/profile-setting")}>
                    Terms & Conditions
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>

            <ul className="hidden md:block space-y-2 text-gray-300">
              <li onClick={() => navigate("/chat")}>Help Center</li>
              <li
                onClick={() => {
                  const section = document.getElementById("how-it-works");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                How it works
              </li>
              <li onClick={() => navigate("/profile-setting")}>
                Privacy Policy
              </li>
              <li onClick={() => navigate("/profile-setting")}>
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full">
            <button
              onClick={() => toggle(3)}
              className="md:hidden w-full flex justify-between hover:text-gray-400 items-center py-3 text-lg font-medium"
            >
              <span>Contact Info</span>
              {open === 3 ? <Minus size={20} /> : <Plus size={20} />}
            </button>

            <h1 className="hidden md:block text-2xl mb-4">Contact Info</h1>

            <AnimatePresence initial={false}>
              {open === 3 && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2 text-gray-300 pl-4 md:hidden"
                >
                  <li>📞 080 707 555-321</li>
                  <li>📧 demo@example.com</li>
                  <li>📍 526 Melrose Street, Water Mill, 11976, NY</li>
                </motion.ul>
              )}
            </AnimatePresence>

            <ul className="hidden md:block space-y-2 text-gray-300">
              <li>📞 080 707 555-321</li>
              <li>📧 demo@example.com</li>
              <li>📍 526 Melrose Street, Water Mill, 11976, NY</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-white/10 pt-5">
        ©{new Date().getFullYear()} Huma-Volve - All Rights Reserved | Terms & Conditions | Privacy
        Policy
      </div>
    </footer>
  );
};

export default Footer;
