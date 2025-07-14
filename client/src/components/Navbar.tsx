import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowBack,
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
    case "Aesthetician":
      return <FaSpa className="text-pink-500" />;
    case "Hotel Rooms":
      return <FaBriefcase className="text-blue-500" />;
    case "Lifestyle":
      return <FaGift className="text-yellow-500" />;
    case "Products":
      return <FaGift className="text-purple-600" />;
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
    case "Hotel Rooms":
      return "Book hotel stays and rooms.";
    case "Lifestyle":
      return "Gifts, flowers, and traditional fashion.";
    case "Products":
      return "Health and wellness product range.";
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
  const [messageIndex, setMessageIndex] = useState(0);
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

  /* fetch searchable data when user opens search */
  useEffect(() => {
    if (!searchOpen) return;
    const fetchAll = async () => {
      try {
        const [services, programs, gifts] = await Promise.all([
          fetch(`${BASE_URL}/services`).then(r => r.json()),
          fetch(`${BASE_URL}/programs`).then(r => r.json()),
          fetch(`${BASE_URL}/gifts`).then(r => r.json()),
        ]);
        setAllItems([
          ...services.map((s: any) => ({ ...s, type: "Service" })),
          ...programs.map((p: any) => ({ ...p, type: "Program" })),
          ...gifts.map((g: any) => ({ ...g, type: "Gift" })),
        ]);
      } catch (e) {
        console.error("Search fetch error:", e);
      }
    };
    fetchAll();
  }, [searchOpen]);

  /* desktop + mobile menu definition */
  const menuSections = [
    {
      key: "services",
      translationKey: "services",
    items: [
      { label: "Wellness",        path: "/services?category=wellness" },
      { label: "Medical",         path: "/services?category=medical" },
      { label: "Aesthetician",    path: "/services?category=aesthetician" },
      { label: "Hotel Rooms",     path: "/services?category=hotel" },        // ➕ NEW
      { label: "Lifestyle",       path: "/services?category=lifestyle" },    // ➕ NEW

   
    ],
      
    },
    {
      key: "programs",
      translationKey: "programs",
      items: [{ label: "Programs", path: "/programs" }],
    },
    {
      key: "gifts",
      translationKey: "giftOptions",
      items: [
        { label: "Individual Gifts", path: "/gifting-options" },
        { label: "Corporate Gifts", path: "/gifting-options" },
        { label: "Ethiopian Diaspora", path: "/gifting-options" },

        
      ],
    },
  ];

  const topMessages = [
    "📢 Latest News: WHW platform is live now!",
    "📣 Announcement: Wellness Camp @ Wenchi starts Aug 5!",
    latestBlog ? `📰 Blog: ${latestBlog.title}` : "📰 Blog: Check out our latest post!",
  ];

  /* ---------- JSX ---------- */
  return (
    <>
      {/* TOP BAR */}
      <div className="flex justify-between items-center bg-green text-white text-xs sm:text-sm px-4 sm:px-6 lg:px-12 py-2 font-inter">
        <div className="flex gap-2 items-center overflow-hidden">
          <button className="bg-[#D4AF37] text-[#1c2b21] font-semibold text-xs px-3 py-1 rounded-full">
            {["News", "Announcement", "Blog"][messageIndex]}
          </button>
          <span
            className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"} ${
              messageIndex === 2 ? "cursor-pointer hover:underline" : ""
            }`}
            onClick={() => {
              if (messageIndex === 2 && latestBlog?.slug) navigate(`/blogs/${latestBlog.slug}`);
            }}
          >
            {topMessages[messageIndex]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setMessageIndex(p => (p - 1 + 3) % 3)}>
            <IoIosArrowBack size={18} />
          </button>
          <button onClick={() => setMessageIndex(p => (p + 1) % 3)}>
            <IoIosArrowForward size={18} />
          </button>
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
                  <ul className="absolute left-0 mt-2 bg-zinc-50 rounded shadow-lg p-6 hidden group-hover:block min-w-[300px] z-50">
                    {section.items.map(item => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="flex items-start gap-3 text-sm py-1.5 rounded px-2 hover:bg-gray-100"
                      >
                        {getIcon(item.label)}
                        <div>
                          <p className="font-semibold">{item.label}</p>
                          <p className="text-xs text-gray-500">{getDescription(item.label)}</p>
                        </div>
                      </Link>
                    ))}
                  </ul>
                </div>
              )
            )}
            <Link to="/company">Company</Link>
            <Link to="/support">
              Support
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
                  placeholder="Search any service, gift, or program..."
                  className="flex-grow px-4 py-2 rounded-full border"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    setSearchQuery(q);
                    setFilteredResults(
                      allItems.filter(it => it.title?.toLowerCase().includes(q))
                    );
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setFilteredResults([]); }}>
                  <X size={20} />
                </button>
              </div>

              {/* results */}
              {searchQuery && (
                <div className="mt-4 bg-white border rounded shadow max-h-64 overflow-y-auto">
                  {filteredResults.length ? (
                    filteredResults.map((item, idx) => {
                      let path = "/";
                      if (item.type === "Program") path = "/programs";
                      else if (item.type === "Service") path = `/services?category=${encodeURIComponent(item.category)}`;
                      else if (item.type === "Gift") path = "/gifting-options";

                      return (
                        <div
                          key={idx}
                          className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                          onClick={() => { navigate(path); setSearchOpen(false); setSearchQuery(""); }}
                        >
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="p-3 text-sm text-gray-500">No results found.</p>
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
                          <Link
                            key={item.label}
                            to={item.path}
                            className="flex items-center gap-2 text-base py-1.5 hover:underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            <IoIosArrowForward size={14} /> {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}

              <Link to="/company" className="text-lg font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Company</Link>
              <Link to="/support" className="text-lg font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Support</Link>

              <div className="flex gap-4 mt-6 text-[#1c2b21]">
                <FaFacebook size={18} />
                <FaLinkedin size={18} />
                <FaInstagram size={18} />
                <FaTiktok size={18} />
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


