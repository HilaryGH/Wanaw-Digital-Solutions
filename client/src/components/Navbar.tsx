import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdLanguage } from "react-icons/md";
import { Link } from "react-router-dom";

import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosSearch,
} from "react-icons/io";
import { X } from "lucide-react";
import { translations } from "./constants/translations";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaLock,
  FaSpa,
  FaStethoscope,
  FaGift,
  FaBriefcase,
} from "react-icons/fa";

const topMessages = [
  "📢 Latest News: WHW platform is live now!",
  "📣 Announcement: Wellness Camp @ Wenchi starts Aug 5!",
  "📰 Blog: 5 Benefits of Regular Massage Therapy.",
];

const getIcon = (item: string) => {
  switch (item) {
    case "Wellness":
      return <FaSpa className="text-green-600" />;
    case "Medical":
      return <FaStethoscope className="text-red-600" />;
    case "Aesthetician":
      return <FaSpa className="text-pink-500" />;
    case "Wellness Retreats":
      return <FaGift className="text-yellow-500" />;
    case "Healing Programs":
      return <FaSpa className="text-blue-600" />;
    case "Corporate Packages":
      return <FaBriefcase className="text-purple-600" />;
    case "Festive Gifts":
    case "Corporate Gifts":
      return <FaGift className="text-yellow-600" />;
    default:
      return <FaGift />;
  }
};

const getDescription = (item: string) => {
  switch (item) {
    case "Wellness":
      return "Relaxation, yoga, and spa treatments.";
    case "Medical":
      return "Health consultations and screenings.";
    case "Aesthetician":
      return "Skin care and beauty services.";
    case "Wellness Retreats":
      return "Getaways for mind and body.";
    case "Healing Programs":
      return "Therapies for personal renewal.";
    case "Corporate Packages":
      return "Solutions for team wellbeing.";
    case "Festive Gifts":
      return "Seasonal gift bundles and more.";
    case "Corporate Gifts":
      return "Branded appreciation packages.";
    default:
      return "";
  }
};
type NavbarProps = {
  onLoginClick?: () => void;
};

function Navbar({}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "am">("en");
  const [langDropdown, setLangDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = translations[lang];

  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const menuSections = [
    {
      key: "services",
      translationKey: "services",
      items: ["Wellness", "Medical", "Aesthetician"],
    },
    {
      key: "programs",
      translationKey: "programs",
      items: ["Wellness Retreats", "Healing Programs", "Corporate Packages"],
    },
    {
      key: "gifts",
      translationKey: "giftOptions",
      items: ["Festive Gifts", "Corporate Gifts"],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setMessageIndex(
        (prev) => (prev - 1 + topMessages.length) % topMessages.length
      );
      setFade(true);
    }, 300);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setMessageIndex((prev) => (prev + 1) % topMessages.length);
      setFade(true);
    }, 300);
  };

  return (
    <>
      {/* 🔁 Top Bar Carousel */}
      <div className="flex justify-between items-center bg-green text-white text-sm px-6 lg:px-12 py-2 font-inter">
        <div className="flex gap-2 items-center overflow-hidden h-[24px]">
          <button className="bg-[#D4AF37] text-[#1c2b21] font-semibold text-xs px-3 py-1 rounded-full">
            {messageIndex === 0
              ? "News"
              : messageIndex === 1
              ? "Announcement"
              : "Blog"}
          </button>
          <span
            className={`transition-opacity duration-700 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {topMessages[messageIndex]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="hover:text-gray-200 transition"
          >
            <IoIosArrowBack size={18} />
          </button>
          <button
            onClick={handleNext}
            className="hover:text-gray-200 transition"
          >
            <IoIosArrowForward size={18} />
          </button>
        </div>
      </div>

      {/* 🔲 Navbar */}
      <header className="bg-zinc-50 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5 md:px-8 lg:px-12 relative">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 z-10 cursor-pointer"
          >
            <img
              src="WHW.jpg"
              alt="Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full"
            />
          </div>

          <nav className="hidden md:flex items-center gap-12 text-black font-inter text-sm lg:text-[16px]">
            {menuSections.map((section) => (
              <div key={section.key} className="relative group">
                <span className="cursor-pointer pb-1 group-hover:text-[#1c2b21]">
                  {t[section.translationKey as keyof typeof t]}{" "}
                  <IoIosArrowDown className="inline ml-1" />
                </span>
                <ul className="absolute left-0 mt-2 bg-zinc-50  text-gray-700 rounded shadow-lg p-6 hidden group-hover:block z-50 min-w-[300px]">
                  {section.items.map((item) => (
                    <div
                      key={item}
                      className="text-gray-700 text-sm py-1.5 flex items-start gap-3"
                    >
                      <div>{getIcon(item)}</div>
                      <div>
                        <p className="font-semibold">{item}</p>
                        <p className="text-xs text-gray-500">
                          {getDescription(item)}
                        </p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            ))}
            <a href="#corporate">Company</a>
            <a href="#support">Support</a>
          </nav>

          <button
            className="text-gray-700 hover:text-gray-900 md:ml-4"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <IoIosSearch size={20} />
          </button>

          <div className="relative hidden md:block">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className="flex items-center gap-2 border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              <MdLanguage className="text-lg" /> Eng{" "}
              <IoIosArrowDown size={14} />
            </button>
            {langDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white shadow-md rounded text-sm z-30">
                <button
                  onClick={() => {
                    setLang("en");
                    setLangDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLang("am");
                    setLangDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  አማርኛ
                </button>
              </div>
            )}
          </div>

          <Link
            to="/login"
            className="ml-4 text-sm font-semibold text-[#1c2b21] cursor-pointer text-xl hover:underline hidden md:block"
          >
            Sign In
          </Link>

          <button
            className="md:hidden z-20 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <div className="flex flex-col gap-1.5">
                <span className="block w-5 h-0.5 bg-green rounded" />
                <span className="block w-4 h-0.5 bg-green rounded ml-auto" />
                <span className="block w-3 h-0.5 bg-green rounded ml-auto" />
              </div>
            )}
          </button>
        </div>

        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 p-4 border-t md:flex md:justify-center">
            <div className="flex items-center gap-2 w-full md:max-w-xl">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow px-4 py-2 rounded-full border focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* 📱 Slide-in Right Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setMenuOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <img src="WHW.jpg" className="h-12 rounded-full" alt="WHW Logo" />
              <X
                className="cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            </div>

            <nav className="flex flex-col space-y-4 font-inter">
              {menuSections.map((section) => (
                <div key={section.key} className="border-b pb-2">
                  <button
                    className="flex items-center justify-between w-full text-lg font-medium py-2"
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === section.key ? null : section.key
                      )
                    }
                  >
                    {t[section.translationKey as keyof typeof t]}
                    <IoIosArrowDown
                      className={`transition-transform ${
                        dropdownOpen === section.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {dropdownOpen === section.key && (
                    <div className="ml-3 space-y-2 mt-2">
                      {section.items.map((item) => (
                        <div
                          key={item}
                          className="text-gray-700 text-base py-1.5 flex items-center"
                        >
                          <IoIosArrowForward className="mr-2 text-sm" /> {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a
                href="#corporate"
                className="text-lg font-medium py-2 border-b border-gray-200"
              >
                Company
              </a>
              <a
                href="#support"
                className="text-lg font-medium py-2 border-b border-gray-200"
              >
                Support
              </a>

              <div className="flex justify-start gap-4 mt-6 text-[#1c2b21]">
                <FaFacebook size={18} />
                <FaLinkedin size={18} />
                <FaInstagram size={18} />
                <FaTiktok size={18} />
              </div>

              <div className="flex justify-start mt-4">
                <Link
                  to="/login"
                  className="bg-[#1c2b21] text-[#D4AF37] text-base px-6 py-2 rounded-md transition font-medium flex items-center gap-2"
                >
                  <FaLock size={16} /> Sign In
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
