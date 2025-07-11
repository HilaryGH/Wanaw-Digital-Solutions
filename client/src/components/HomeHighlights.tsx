import { FaSpa, FaGift, FaBriefcase } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { Link } from "react-router-dom";

const HomeHighlights = () => {
  const highlights = [
  {
    icon: <FaSpa className="text-pink-500 text-3xl sm:text-4xl" />,
    title: "Wellness & Spa",
    description:
      "Book massages, yoga sessions, steam baths, and spa treatments with ease.",
    link: "/services?category=spa", // ✅ query param
    action: "Explore Spa",
  },
  {
    icon: <MdMedicalServices className="text-cyan-500 text-3xl sm:text-4xl" />,
    title: "Medical Services",
    description:
      "Access verified physiotherapy, labs, and online doctor consultations.",
    link: "/services?category=medical", // ✅ query param
    action: "View Medical",
  },
  {
    icon: <FaGift className="text-yellow-500 text-3xl sm:text-4xl" />,
    title: "Gift Options",
    description:
      "Send health & wellness gifts to family, friends, or corporate partners.",
    link: "/gifting-options", // ✅ query param
    action: "Send a Gift",
  },
  {
    icon: <FaBriefcase className="text-green-500 text-3xl sm:text-4xl" />,
    title: "Corporate Wellness",
    description:
      "Tailored health packages, hotel rooms, and event gifting for institutions.",
    link: "/services?category=corporate", // ✅ query param
    action: "See Options",
  },
];


  return (
    <section className="relative bg-green pt-20 pb-24 px-6 sm:px-10 md:px-20 overflow-hidden">
      {/* 🔷 Top-Right Curved Cutout */}
      <div className="absolute top-0 right-0 w-full h-32 overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-full"
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
        >
          <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-10">
        {/* Top: Image + Two Highlights */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/Mindfulness.svg"
              alt="Wellness Illustration"
              className="w-full max-w-[400px] md:max-w-[500px] rounded-full shadow-lg"
            />
          </div>

          {/* First 2 highlights */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {highlights.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-md shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="min-w-[40px]">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white mb-3">{item.description}</p>
                  <Link
                    to={item.link}
                    className="inline-block bg-[#D4AF37] text-green font-semibold text-sm px-4 py-2 rounded-full hover:rounded-md hover:text-[#1c2b21] transition"
                  >
                    {item.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 2 highlights below image */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.slice(2).map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white/10 backdrop-blur-md shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="min-w-[40px]">{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-white mb-3">{item.description}</p>
                <Link
                  to={item.link}
                  className="inline-block bg-[#D4AF37] text-green font-semibold text-sm px-4 py-2 rounded-full hover:rounded-md hover:text-[#1c2b21] transition"
                >
                  {item.action}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHighlights;
