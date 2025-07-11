import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function FestivitiesT() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const festivals = [
    { title: "Ashenda", desc: "A celebration of girlhood, music, and tradition in Tigray." },
    { title: "Irreechaa", desc: "Oromo thanksgiving festival honoring nature and unity." },
    { title: "Meskel", desc: "The finding of the True Cross, celebrated with bonfires." },
    { title: "Timket", desc: "Epiphany celebration with processions and holy water." },
    { title: "Buhe", desc: "Ethiopian Orthodox holiday celebrated with songs and bonfires." },
    { title: "Enkutatash", desc: "Ethiopian New Year, marked with gift-giving and celebration." },
    { title: "Genna", desc: "Ethiopian Orthodox Christmas, celebrated on January 7th." },
    { title: "Fasika", desc: "Ethiopian Easter, a significant religious celebration." },
    { title: "Mother's Day", desc: "Celebrating the love and care of mothers around the world." },
    { title: "Father's Day", desc: "Honoring fathers and paternal bonds." },
    { title: "Valentine's Day", desc: "A day for love, affection, and romantic gestures." },
    { title: "International Women's Day", desc: "A global day celebrating women's achievements." },
    { title: "World Health Day", desc: "Promoting health awareness and well-being globally." },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* 🎉 Hero Image Section */}
      <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen">
        <img
          src="/Festivities.svg"
          alt="Festivities Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black opacity-40 z-10" />
        <div className="relative z-20 flex items-center justify-center h-full text-center text-gold px-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Ethiopian & Global Celebrations
            </h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto">
              Let’s celebrate culture, heritage, and unity together.
            </p>
          </div>
        </div>
      </div>

      {/* 🌀 Decorative SVG Top Wave */}
      <div className="absolute top-full left-0 w-full h-32 overflow-hidden leading-[0] z-20 -mt-1">
        <svg
          className="relative block w-full h-full"
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
        >
          <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="#d4af37" />
        </svg>
      </div>

      {/* 🎠 Festival Cards Section */}
      <section className="relative z-30 -mt-16 sm:-mt-24 md:-mt-28 px-4 sm:px-8 md:px-16 pb-12">
        
          <div
            className="
             
              scroll-content
            "
          >
            <div className="flex gap-6 sm:gap-8 md:gap-10 min-w-max pb-2">
              {festivals.map((festival, idx) => (
                <div
                  key={idx}
                  className="min-w-[260px] sm:min-w-[300px] flex-shrink-0
                             bg-[#D4AF37] border border-none
                             p-5 rounded-2xl
                             hover:scale-105 transform transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{festival.title}</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">{festival.desc}</p>
                </div>
              ))}
            </div>
          </div>
      </section>
    </div>
  );
}

export default FestivitiesT;






