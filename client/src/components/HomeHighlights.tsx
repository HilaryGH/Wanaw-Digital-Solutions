import { FaListAlt, FaUserFriends, FaCalendarAlt, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeHighlights = () => {
  const highlights = [
    {
      icon: <FaListAlt className="text-gold text-3xl sm:text-4xl" />,
      title: "Browse Services by Category",
      description:
        "Explore curated health & wellness services — including spa, physiotherapy, diagnostics, and more.",
      link: "/services",
      action: "Explore Services",
    },
    {
      icon: <FaUserFriends className="text-gold text-3xl sm:text-4xl" />,
      title: "Choose Your Role",
      description:
        "Gift as an individual (for friends & family) or as a corporate (for employees, clients, or partners).",
      link: "/gifting-options",
      action: "Start Gifting",
    },
    {
      icon: <FaCalendarAlt className="text-gold text-3xl sm:text-4xl" />,
      title: "Pick the Occasion",
      description:
        "Celebrate festivals, milestones, or personal moments like birthdays, weddings, or thank-you gestures.",
      link: "/gifting-occasions",
      action: "View Occasions",
    },
    {
      icon: <FaPaperPlane className="text-gold text-3xl sm:text-4xl" />,
      title: "Send with a Personal Touch",
      description:
        "Customize your gift with messages, scheduling, and optional branding — we’ll handle the rest!",
      link: "/how-it-works",
      action: "How It Works",
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
    <div className="text-center mb-14">
  <h2 className="relative inline-block text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
    <span className="relative z-10">
      Your Seamless Gifting Journey with <span className="text-yellow-300">Wanaw</span>
    </span>
    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-yellow-400 rounded-full opacity-60 blur-sm"></span>
  </h2>
  <p className="mt-4 text-white/80 text-sm md:text-base max-w-xl mx-auto">
   Discover how Wanaw, a digital health and wellness platform, makes gifting joyful, thoughtful, and effortless — for everyone and every occasion.
  </p>
</div>


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
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHighlights;

