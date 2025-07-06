import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GiftingOptions = () => {
  const [selectedCorporateGift, setSelectedCorporateGift] = useState("");
  const [selectedIndividualGift, setSelectedIndividualGift] = useState("");
  const navigate = useNavigate();

  const corporateGifts = [
    "Welcome Kit",
    "Chocolate Gift Box",
    "Branded Water Bottle",
    "Gifting for Her",
    "Gifting for Him",
    "Festival Hampers",
    "Milestone Awards",
    "Client Appreciation Gifts",
    "Holiday Gift Boxes",
  ];

  const individualGifts = [
    "Birthday Cake & Card",
    "Personalized Mug",
    "Spa Gift Card",
    "Graduation Frame",
    "Valentine’s Flowers",
    "Traditional Basket",
    "Mother’s Day Gift",
    "Father’s Day Gift",
    "Thank You Gift",
    "Friendship Token",
  ];

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-[#fefefe] py-24 px-6 sm:px-10 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c2b21] mb-4">
          Select a Gifting Experience
        </h1>
        <p className="text-gray-600 text-lg mb-14">
          Whether you're honoring a corporate milestone or celebrating a
          personal memory, we've got something special for every occasion.
        </p>

        <div className="grid md:grid-cols-2 gap-14">
          {/* Corporate Gifting */}
          <div className="bg-[#1c2b21] text-gold p-10 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.015] relative z-10">
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Corporate Gifting
            </h3>
            <p className="text-gold text-sm mb-6 text-center">
              Thoughtful gifts that strengthen business relationships — perfect
              for teams, partners, and clients.
            </p>

            <label
              htmlFor="corporateGift"
              className="block mb-2 text-sm font-medium"
            >
              Select a Gift:
            </label>
            <select
              id="corporateGift"
              value={selectedCorporateGift}
              onChange={(e) => setSelectedCorporateGift(e.target.value)}
              className="w-full mt-1 mb-6 p-3 rounded-lg text-[#1c2b21] bg-white shadow-inner focus:outline-none appearance-auto relative z-20"
              style={{ minHeight: "50px" }}
            >
              <option value="">-- Choose Corporate Gift --</option>
              {corporateGifts.map((gift, index) => (
                <option key={index} value={gift}>
                  {gift}
                </option>
              ))}
            </select>

            {selectedCorporateGift && (
              <>
                <p className="mt-2 text-[#d4af37] font-medium text-sm">
                  ✅ Selected: {selectedCorporateGift}
                </p>
                <button
                  onClick={() =>
                    navigate(`/gift-details/${slugify(selectedCorporateGift)}`)
                  }
                  className="mt-5 w-full bg-[#d4af37] text-[#1c2b21] py-2.5 rounded-full shadow-md hover:rounded-md font-semibold transition duration-300"
                >
                  Continue to Details
                </button>
              </>
            )}
          </div>

          {/* Individual Gifting */}
          <div className="bg-[#D4AF37] text-[#1c2b21] p-10 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.015] relative z-10">
            <h3 className="text-2xl font-semibold mb-3 text-center">
              Individual Gifting
            </h3>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Celebrate birthdays, anniversaries, and every little win with
              handpicked, heartfelt gifts.
            </p>

            <label
              htmlFor="individualGift"
              className="block mb-2 text-sm font-medium"
            >
              Select a Gift:
            </label>
            <select
              id="individualGift"
              value={selectedIndividualGift}
              onChange={(e) => setSelectedIndividualGift(e.target.value)}
              className="w-full mt-1 mb-6 p-3 rounded-lg text-[#1c2b21] bg-white shadow-inner focus:outline-none appearance-auto relative z-20"
              style={{ minHeight: "50px" }}
            >
              <option value="">-- Choose Individual Gift --</option>
              {individualGifts.map((gift, index) => (
                <option key={index} value={gift}>
                  {gift}
                </option>
              ))}
            </select>

            {selectedIndividualGift && (
              <>
                <p className="mt-2 text-black font-medium text-sm">
                  Selected: {selectedIndividualGift}
                </p>
                <button
                  onClick={() =>
                    navigate(`/gift-details/${slugify(selectedIndividualGift)}`)
                  }
                  className="mt-5 w-full bg-[#1c2b21] text-gold py-2.5 rounded-full shadow-md hover:rounded-md font-semibold transition duration-300"
                >
                  Continue to Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftingOptions;
