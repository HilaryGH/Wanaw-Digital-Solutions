import { useNavigate } from "react-router-dom";

export default function CommunitySelection() {
  const navigate = useNavigate();

  const cardBaseClasses =
    "cursor-pointer rounded-3xl bg-white border-l-8 shadow-lg p-6 sm:p-8 transition-transform hover:scale-105 hover:shadow-2xl";
  const headingClasses = "text-xl sm:text-2xl font-bold mb-3 text-yellow-600";
  const paragraphClasses = "text-gray-700 text-sm sm:text-base leading-relaxed";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 sm:mb-12 text-center text-[#1c2b21] tracking-wide">
        Engage with Our Communities
      </h2>

      {/* Community Cards Section - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-14">
        {/* Wanaw Community Membership */}
        <div
          onClick={() => navigate("/community/membership")}
          className={`${cardBaseClasses} border-[#1c2b21]`}
          role="button"
          tabIndex={0}
          onKeyDown={() => navigate("/community/membership")}
        >
          <h3 className={headingClasses}>Professionals Community</h3>
          <p className={paragraphClasses}>
            Are you a healthcare professional? Join the Wanaw Community for various strategic opportunities,
            partnerships, and internship programs for fresh graduates.
          </p>
        </div>

        {/* Diaspora Community */}
        <div
          onClick={() => navigate("/community/diaspora")}
          className={`${cardBaseClasses} border-yellow-600`}
          role="button"
          tabIndex={0}
          onKeyDown={() => navigate("/community/diaspora")}
        >
          <h3 className={headingClasses}>Diaspora Community</h3>
          <p className={paragraphClasses}>
            Stay connected and feel at home with loved ones through meaningful health and wellness gifts.
          </p>
        </div>

        {/* Support Community */}
        <div
          onClick={() => navigate("/community/support")}
          className={`${cardBaseClasses} border-[#1c2b21]`}
          role="button"
          tabIndex={0}
          onKeyDown={() => navigate("/community/support")}
        >
          <h3 className={headingClasses}>Support Community</h3>
          <p className={paragraphClasses}>
            Provide funding or gifts for the treatment and medications of Hemodialysis patients.
          </p>
        </div>
      </div>

      {/* Patient Registration Section - At the Bottom */}
      <div
        onClick={() => navigate("/community/kidney")}
        className={`${cardBaseClasses} max-w-3xl mx-auto border-[#1c2b21]`}
        role="button"
        tabIndex={0}
        onKeyDown={() => navigate("/community/kidney")}
      >
        <h3 className="text-2xl sm:text-3xl font-semibold text-[#1c2b21] mb-4">
          Hemodialysis Patient Form
        </h3>
        <p className={paragraphClasses}>
          If you are a Hemodialysis patient, fill out this form to be part of our support system for patients.
        </p>
      </div>
    </div>
  );
}





