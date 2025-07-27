import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";


import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";

import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosSearch,
} from "react-icons/io";
import { MdLanguage } from "react-icons/md";
import { X } from "lucide-react";
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
import { translations } from "./constants/translations";

/* ---------- helpers ---------- */
const getIcon = (item: string) => {
  switch (item) {
    case "Wellness":
      return <FaSpa className="text-green-600" />;
    case "Medical":
      return <FaStethoscope className="text-red-600" />;
    
    case "Hotel Rooms":
      return <FaBriefcase className="text-blue-500" />;
    case "home based services":
      return <FaGift className="text-yellow-500" />;
    
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
    case "Home Based/Mobile Services":
      return "Enjoy services delivered to your home or location of choice.";
    case "Hotel Rooms":
      return "Book hotel stays and rooms.";
    default:
      return "";
  }
};


/* ---------- component ---------- */
const Navbar = () => {
  const navigate = useNavigate();

  /* language + menus */
  const [lang, setLang] = useState<"en" | "am">("en");
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [langDropdown, setLangDropdown] = useState(false);

  /* search */
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allItems, setAllItems] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);


  /* top messages */
  const [, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [latestBlog, setLatestBlog] = useState<{ title: string; slug: string } | null>(null);

  /* fetch blog title once */
  useEffect(() => {
    fetch(`${BASE_URL}/posts`)
      .then(r => r.json())
      .then(d => d && d.length && setLatestBlog(d[0]))
      .catch(console.error);
  }, []);

  /* rotate top bar messages */
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex(p => (p + 1) % 3);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
  console.log("All items:", allItems);
  if (Array.isArray(allItems)) {
    console.log("First item:", allItems[0]);
  } else {
    console.error("allItems is not an array");
  }
}, [allItems]);


  /* fetch searchable data when user opens search */
 useEffect(() => {
  if (!searchOpen || allItems.length > 0) return; // Don't fetch again if already fetched

  const fetchAll = async () => {
    try {
      const [services, programs, gifts] = await Promise.all([
        fetch(`${BASE_URL}/services`).then(r => r.json()),
        fetch(`${BASE_URL}/programs`).then(r => r.json()),
        fetch(`${BASE_URL}/gifts`).then(r => r.json()),
      ]);

      setAllItems([
        ...(Array.isArray(services) ? services.map((s: any) => ({ ...s, type: "Service" })) : []),
        ...(Array.isArray(programs) ? programs.map((p: any) => ({ ...p, type: "Program" })) : []),
        ...(Array.isArray(gifts) ? gifts.map((g: any) => ({ ...g, type: "Gift" })) : []),
      ]);

      console.log("Services:", services);
      console.log("Programs:", programs);
      console.log("Gifts:", gifts);
    } catch (e) {
      console.error("Search fetch error:", e);
    }
  };

  fetchAll();
}, [searchOpen, allItems]);




  type MenuChild = {
  label: string;
  path: string;
};

type MenuSubItem = {
  label: string;
  path: string;
  children?: MenuChild[]; // optional!
};

type MenuItem = {
  label: string;
  path: string;
  subItems?: MenuSubItem[];
};

type MenuSection = {
  key: string;
  translationKey: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    key: "services",
    translationKey: "services",
    items: [
      {
        label: "Wellness",
        path: "/services?category=wellness",
      },
      {
        label: "Medical",
        path: "/services?category=medical",
      },
      {
        label: "Home Based/Mobile Services",
        path: "/services?category=Home Based/Mobile Services",
      },
      {
        label: "Hotel Rooms",
        path: "/services?category=hotel",
      },
     
    ],
  },
  {
    key: "programs",
    translationKey: "programs",
    items: [
      {
        label: "Programs",
        path: "/programs",
      },
    ],
  },
  {
    key: "gifts",
    translationKey: "giftOptions",
    items: [
      {
        label: "Individual Gifts",
        path: "/gifting-options?type=individual",
      },
      {
        label: "Corporate Gifts",
        path: "/gifting-options?type=corporate",
      },
      {
        label: "Ethiopian Diaspora",
        path: "/gifting-options?type=diaspora",
      },
    ],
  },
];

  /* ---------- JSX ---------- */
  return (
    <>
   {/* TOP BAR */}
<div className="flex flex-col sm:flex-row justify-between  bg-green text-white text-xs sm:text-sm px-4 sm:px-6 lg:px-12 py-2 font-inter gap-2 sm:gap-0">
  {/* Left Side - Blog */}
  <div className="flex items-center gap-2 order-1 sm:order-none">
    <button
      className="bg-[#D4AF37] text-[#1c2b21] font-semibold text-xs px-3 py-1 rounded-full"
      onClick={() => latestBlog?.slug && navigate(`/blogs/${latestBlog.slug}`)}
    >
      Blog
    </button>
    <span
      className={`transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      } cursor-pointer hover:underline`}
      onClick={() => latestBlog?.slug && navigate(`/blogs/${latestBlog.slug}`)}
    >
      {latestBlog?.title || "View our latest blog"}
    </span>
  </div>

  {/* Right Side - Contact Info */}
  <div className="hidden md:grid grid-cols-4 gap-6 text-center order-0 sm:order-none">
    <div>
      <a href="tel:+251989177777" className="text-gray-300">
        <FaPhoneAlt className="text-gold text-lg  mx-auto mb-1" />
      </a>
    </div>
    <div>
      <a href="mailto:g.fikre2@gmail.com" className="text-gray-300">
        <FaEnvelope className="text-gold text-lg  mx-auto mb-1" />
      </a>
    </div>
    <div>
      <a
        href="https://wa.me/251989177777"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300"
      >
        <FaWhatsapp className="text-gold text-lg  mx-auto mb-1" />
      </a>
    </div>
    <div>
      <a
        href="https://t.me/+251989177777"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300"
      >
        <SiTelegram className="text-gold text-lg  mx-auto mb-1" />
      </a>
    </div>
  </div>
</div>


      {/* NAVBAR */}
      <header className="bg-zinc-50 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5 md:px-8 lg:px-12 relative">
          {/* logo */}
          <img
            src="WHW.jpg"
            alt="Logo"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* DESKTOP LINKS */}
          <nav className="hidden md:flex items-center gap-12 text-sm lg:text-[16px]">
            {/* render Program as simple link, others as dropdowns */}
            
             <Link to="/company">About</Link>
            
          {menuSections.map(section =>
  section.key === "programs" ? (
    <Link
      key={section.key}
      to="/programs"
      className=" hover:text-[#1c2b21]"
    >
      {t[section.translationKey as keyof typeof t]}
      <IoIosArrowDown className="inline ml-1" />
    </Link>
  ) : (
    <div key={section.key} className="relative group">
      <span className="cursor-pointer pb-1 group-hover:text-[#1c2b21]">
        {t[section.translationKey as keyof typeof t]}{" "}
        <IoIosArrowDown className="inline ml-1" />
      </span>
      <ul className="absolute left-0 mt-2 bg-zinc-50 rounded shadow-lg p-12 gap-10 hidden group-hover:block min-w-[400px] z-50">
        {section.items.map(item => (
          <div key={item.label} className="relative group/item">
            <Link
              to={item.path}
              className="flex items-start gap-8 text-sm py-3 rounded px-2 hover:bg-gray-100"
            >
              {getIcon(item.label)}
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-gray-500">{getDescription(item.label)}</p>
              </div>
              {item.subItems?.length ? (
                <IoIosArrowForward className="ml-auto mt-1" />
              ) : null}
            </Link>

            {item.subItems?.length && (
              <ul className="absolute top-0 left-full ml-1 bg-zinc-100 p-4 rounded shadow-lg hidden group-hover/item:block min-w-[250px]">
                {item.subItems.map(sub => (
                  <div key={sub.label}>
                    <Link
                      to={sub.path}
                      className="block py-1 px-2 text-sm hover:bg-gray-200 rounded"
                    >
                      {sub.label}
                    </Link>

                    {sub.children?.length && (
                      <ul className="pl-4 mt-1 space-y-1">
                        {sub.children?.map(child=> (
                          <Link
                            key={child.label}
                            to={child.path}
                            className="block text-xs py-1 px-2 hover:bg-gray-100 rounded"
                          >
                            - {child.label}
                          </Link>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  )
)}

      <Link to="/support">
              Customer Support & Help Center
            </Link>

           
          </nav>

          {/* search icon */}
          <button onClick={() => setSearchOpen(o => !o)} className="md:ml-4">
            <IoIosSearch size={20} />
          </button>

          {/* language */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangDropdown(o => !o)}
              className="flex items-center gap-2 border px-3 py-1 rounded"
            >
              <MdLanguage /> Eng <IoIosArrowDown size={14} />
            </button>
            {langDropdown && (
              <div className="absolute top-full mt-1 w-full bg-white shadow rounded text-sm">
                <button onClick={() => { setLang("en"); setLangDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button onClick={() => { setLang("am"); setLangDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">አማርኛ</button>
              </div>
            )}
          </div>

          {/* sign in */}
          <Link to="/login" className="hidden md:block ml-4 font-semibold hover:underline">
            Sign In
          </Link>

          {/* hamburger */}
          <button className="md:hidden z-20 p-2" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X className="w-6 h-6" /> : (
              <div className="flex flex-col gap-1">
                <span className="block w-5 h-0.5 bg-green" />
                <span className="block w-4 h-0.5 bg-green ml-auto" />
                <span className="block w-3 h-0.5 bg-green ml-auto" />
              </div>
            )}
          </button>
        </div>

        {/* SEARCH OVERLAY */}
  {searchOpen && (
  <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 p-4 border-t md:flex md:justify-center">
    <div className="w-full md:max-w-xl">
      {/* input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by title, category, location..."
          className="flex-grow px-4 py-2 rounded-full border text-sm"
          autoFocus
          value={searchQuery}
          onChange={(e) => {
            const q = e.target.value.toLowerCase();
            setSearchQuery(q);

         

setFilteredResults(
  allItems.filter((item) => {
    const titleMatch = String(item.title || "").toLowerCase().includes(q);
    const categoryMatch = String(item.category || "").toLowerCase().includes(q);
    const locationMatch = String(item.location || "").toLowerCase().includes(q);
    const priceMatch = String(item.price || "").toLowerCase().includes(q);
    const ratingMatch = String(item.rating || "").toLowerCase().includes(q);

    return (
      titleMatch ||
      categoryMatch ||
      locationMatch ||
      priceMatch ||
      ratingMatch
    );
  })
);

               
        
          }}
        />
        <button
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery("");
            setFilteredResults([]);
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* results */}
      {searchQuery && (
  <div className="mt-4 bg-white border rounded shadow max-h-64 overflow-y-auto">
    {filteredResults.length ? (
      filteredResults.map((item, idx) => {
        let path = "/";
        if (item.type === "Program") {
          path = "/programs";
        } else if (item.type === "Service") {
          path = `/services?category=${encodeURIComponent(
            item.category
          )}&location=${encodeURIComponent(item.location)}`;
        } else if (item.type === "Gift") {
          path = "/gifting-options";
        }

        return (
          <a
            key={idx}
            href={path}
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
          >
            <strong>{item.title}</strong> <br />
            <span className="text-xs text-gray-500">
              {item.category} | {item.location} | ${item.price} | ⭐ {item.rating}
            </span>
          </a>
        );
      })
    ) : (
      <p className="text-center text-gray-500 p-2 text-sm">No results found.</p>
    )}
  </div>
)}

    </div>
  </div>
)}

        {/* MOBILE MENU */}
        <div className={`fixed inset-0 z-40 transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <img src="WHW.jpg" className="h-12 rounded-full" />
              <X className="cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>

            <nav className="flex flex-col space-y-4">

              <Link to="/" className="text-lg font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Home</Link>
   <Link to="/company" className="text-lg font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>About</Link>
              {menuSections.map(section => (
  section.key === "programs" ? (
    <Link
      key={section.key}
      to="/programs"
      className="text-lg font-medium py-2 border-b"
      onClick={() => setMenuOpen(false)}
    >
      {t[section.translationKey as keyof typeof t]}
    </Link>
  ) : (
    <div key={section.key} className="border-b pb-2">
      <button
        className="flex items-center justify-between w-full text-lg font-medium py-2"
        onClick={() => setDropdownOpen(d => d === section.key ? null : section.key)}
      >
        {t[section.translationKey as keyof typeof t]}
        <IoIosArrowDown className={`transition-transform ${dropdownOpen === section.key ? "rotate-180" : ""}`} />
      </button>

      {dropdownOpen === section.key && (
        <div className="ml-3 space-y-2 mt-2">
          {section.items.map(item => (
            <div key={item.label}>
              <Link
                to={item.path}
                className="flex items-center gap-2 text-base py-1.5 hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                <IoIosArrowForward size={14} /> {item.label}
              </Link>

              {/* Nested Subitems */}
              {item.subItems?.map(sub => (
                <div key={sub.label} className="ml-5 mt-1">
                  <Link
                    to={sub.path}
                    className="block text-sm py-1 text-gray-700 hover:underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    {sub.label}
                  </Link>

                  {/* Nested Children */}
                  {sub.children?.map(child => (
                    <Link
                      key={child.label}
                      to={child.path}
                      className="block ml-4 text-sm py-0.5 text-gray-600 hover:underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      - {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
))}
  <Link to="/support" className="text-lg font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Customer Support & Help Center</Link>

              <div className="flex gap-4 mt-6 text-[#1c2b21]">
  <a href="https://www.facebook.com/share/14JxGfvVv4C/" target="_blank" rel="noopener noreferrer">
    <FaFacebook size={18} />
  </a>
  <a href="https://www.linkedin.com/company/wanaw-health-and-wellness-digital-solution/" target="_blank" rel="noopener noreferrer">
    <FaLinkedin size={18} />
  </a>
  <a href="https://www.instagram.com/wanaw_health_and_wellness_?igsh=bmJxdTVkMGY3NDVn" target="_blank" rel="noopener noreferrer">
    <FaInstagram size={18} />
  </a>
  <a href="https://www.tiktok.com/@wanawhealthandwellness?_t=ZM-8yBOhm4EAIa&_r=1" target="_blank" rel="noopener noreferrer">
    <FaTiktok size={18} />
  </a>
</div>


              <Link
                to="/login"
                className="mt-6 bg-[#1c2b21] text-[#D4AF37] px-6 py-2 rounded-md flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <FaLock size={18} /> Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;


