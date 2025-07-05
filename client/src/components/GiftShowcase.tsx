import { useEffect, useState } from "react";

const GiftShowcase = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const cardData = [
    {
      title: "Gift Givers",
      items: [
        "Corporate: Companies, Entities, Institutions",
        "Individuals: Anyone with a reason to celebrate",
      ],
      buttonText: "Start Gifting Now",
    },
    {
      title: "Gift Receivers",
      items: [
        "Corporate: Employees, Clients, Partners",
        "Individuals: Family, Friends, Loved Ones",
      ],
      buttonText: "Send a Surprise",
    },
  ];

  const occasionData = [
    {
      title: "Corporate Gifting",
      items: [
        "Festivals (Ashenda, Irreechaa, Enkutatash, Timket, etc.)",
        "Milestones & Celebrations",
        "Chocolate gifting & gender-specific options",
        "Welcome kits for new employees",
      ],
      buttonText: "Explore Corporate Gifts",
    },
    {
      title: "Individual Gifting",
      items: [
        "Birthdays, Anniversaries, Weddings, Graduations",
        "Festivals (Valentine’s, Mother's Day, Eid, etc.)",
        "Thank-you, Sympathy & Congratulations",
        "Friendship & Relationship Gifts",
      ],
      buttonText: "Find the Perfect Gift",
    },
  ];

  return (
    <section className="gift-section relative bg-[#f9fafb] py-20 px-6 sm:px-10 md:px-20 overflow-hidden">
      {/* Decorative SVG top wave */}
      <div className="absolute top-0 right-0 w-full h-32 overflow-hidden leading-[0] z-10">
        <svg
          className="relative block w-full h-full"
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
        >
          <path d="M500,0 C400,80 100,0 0,80 L0,0 L500,0 Z" fill="#d4af37" />
        </svg>
      </div>

      {/* Section content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold text-[#1c2b21] text-center mb-8 ${
            animate ? "animate-fadeSlideUp" : ""
          }`}
        >
          Gifting Solutions
        </h2>
        <p
          className={`text-center text-gray-700 max-w-3xl mx-auto text-lg mb-16 leading-relaxed ${
            animate ? "animate-fadeSlideUp animate-fadeSlideUp-delay-1" : ""
          }`}
        >
          Wanaw Health and Wellness is your one-stop destination for meaningful
          corporate and individual gifting. From branded corporate packages to
          heartfelt personal gestures — discover a thoughtful way to give.
        </p>

        {/* Clip path definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath
              id="clipRightCcurveInverted"
              clipPathUnits="objectBoundingBox"
            >
              <path d="M0,0 H1 C0.9,0 0.8,0.5 1,1 H0 V1 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Gift Givers & Receivers */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {cardData.map((card, idx) => (
            <div
              key={idx}
              className={`bg-green text-gold shadow-lg p-6 md:p-8 rounded-2xl relative overflow-hidden hover-scale ${
                animate
                  ? `animate-fadeSlideUp animate-fadeSlideUp-delay-${idx + 2}`
                  : ""
              }`}
              style={{ clipPath: "url(#clipRightCcurveInverted)" }}
            >
              <h3 className="text-xl font-semibold mb-4 text-center">
                {card.title}
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {card.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className="text-center mt-6">
                <button className="bg-[#d4af37] text-[#1c2b21] py-2 px-5 rounded-full shadow-md transition duration-300 hover:rounded-md text-sm md:text-base">
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Gifting Occasions */}
        <h3
          className={`text-2xl font-bold text-center text-[#1c2b21] mb-10 ${
            animate ? "animate-fadeSlideUp animate-fadeSlideUp-delay-4" : ""
          }`}
        >
          Gifting Occasions
        </h3>

        <div className="grid md:grid-cols-2 gap-10">
          {occasionData.map((card, idx) => (
            <div
              key={idx}
              className={`bg-green text-gold shadow-md p-6 md:p-8 rounded-2xl relative overflow-hidden hover-scale ${
                animate
                  ? `animate-fadeSlideUp animate-fadeSlideUp-delay-${idx + 2}`
                  : ""
              }`}
              style={{ clipPath: "url(#clipRightCcurveInverted)" }}
            >
              <h4 className="text-lg font-semibold mb-4 text-center">
                {card.title}
              </h4>
              <ul className="list-disc list-inside space-y-2">
                {card.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className="text-center mt-6">
                <button className="bg-[#d4af37] text-[#1c2b21] py-2 px-5 rounded-full shadow-md transition duration-300 hover:rounded-md text-sm md:text-base">
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftShowcase;
