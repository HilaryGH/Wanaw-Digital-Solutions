import { Link } from "react-router-dom";
import HomeHighlights from "./HomeHighlights";

import GiftShowcase from "./GiftShowcase";

import MembershipPreview from "./MembershipPreview";

import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="relative h-screen w-full bg-zinc-50 text-gold overflow-hidden">
        {/* 🔳 Overlay Bar at Bottom */}

        {/* 🔗 Partners Logo Scroll Bar */}
        <div className=" social-bar py-6 overflow-hidden ">
          <div className=" scrolling-icons">
            <img
              src="/EthioTel.png"
              alt="Ethio Telecom"
              className="h-10 sm:h-12  object-contain"
            />
            <img
              src="/Capital.png"
              alt="Capital Bank"
              className="h-10 sm:h-12 object-contain"
            />
            <img
              src="/Crowdfunding.png"
              alt="Crowdfunding"
              className="h-10 sm:h-12 object-contain"
            />
            {/* Repeat for continuous scroll effect */}
            <img
              src="/EthioTel.png"
              alt="Ethio Telecom"
              className="h-10 sm:h-12 object-contain"
            />
            <img
              src="/Capital.png"
              alt="Capital Bank"
              className="h-10 sm:h-12 object-contain"
            />
            <img
              src="/Crowdfunding.png"
              alt="Crowdfunding"
              className="h-10 sm:h-12 object-contain"
            />
          </div>
        </div>

        {/* 🌟 Main Hero Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-5 h-full px-4 sm:px-6 md:px-16 lg:px-28 py-10 md:py-0">
          {/* 📄 Left: Text */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-left space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[#1c2b21] text-center leading-snug md:leading-tight">
              Wanaw Digital Solutions
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 text-center max-w-md">
              Empowering your business with digital innovation — one service at
              a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto text-center bg-[#D4AF37] text-[#1c2b21] font-semibold px-6 py-2.5 rounded-full border border-gray-300 shadow-sm hover:rounded transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto text-center bg-[#1c2b21] text-[#D4AF37] font-semibold px-6 py-2.5 rounded-full shadow hover:rounded transition"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* 🖼️ Right: Hero Image */}
          <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
            <img
              src="/hero.svg"
              alt="Digital Innovation"
              className="w-4/5 sm:w-3/4 md:w-full max-h-[500px] object-contain animate-fade-slide-in"
            />
          </div>
        </div>
      </div>
      <div></div>
      {/* 🟣 Section with Animated Inner Circle */}
      <div className="relative h-auto min-h-screen bg-[#f9fafb] px-6 py-24 sm:py-32 overflow-hidden">
        {/* 🎨 Decorative Background */}
        <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-br-[300px] shadow-xl opacity-80 z-0" />
        <div className="absolute top-[140px] left-[50px] w-[150px] h-[150px] bg-yellow-200 rounded-full shadow-md opacity-70 z-0 animate-bob" />

        {/* 🌟 Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Heading with Accent Line */}
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c2b21] mb-4">
              About <span className="text-yellow-500">Wanaw</span>
            </h2>
            <div className="w-20 h-1 mx-auto bg-yellow-500 rounded-full" />
          </div>

          {/* Main Content */}
          <div className="text-gray-700 space-y-6 text-base md:text-lg leading-relaxed">
            <p className="animate-fade-in">
              At{" "}
              <span className="font-semibold text-[#1c2b21]">
                Wanaw Health and Wellness
              </span>
              , we believe everyone deserves access to services that nurture
              their mind, body, and lifestyle. Our platform is a bridge between
              users and certified providers — making health and self-care
              effortless and convenient.
            </p>
            <p className="animate-fade-in delay-150">
              Whether you're seeking a relaxing massage, a doctor consultation,
              or a heartfelt wellness gift — Wanaw delivers trusted options
              right at your fingertips.
            </p>
            <p className="text-yellow-700 font-semibold italic text-xl animate-fade-in delay-300">
              “Your wellness, our purpose.”
            </p>
          </div>
        </div>
      </div>

      <HomeHighlights />
      <MembershipPreview />
      <GiftShowcase />
      <Footer />
    </>
  );
};

export default Home;
