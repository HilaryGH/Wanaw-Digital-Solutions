import { useNavigate } from "react-router-dom";

export default function CommunitySelection() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-[#1c2b21] tracking-wide">
      Engage with Our Communities or Register for Patient Support
      </h2>

      {/* Patient Registration Section */}
      <div
        onClick={() => navigate("/community/kidney")}
        className="cursor-pointer max-w-3xl mx-auto mb-16 rounded-3xl border-l-8 border-yellow-400 bg-white shadow-lg p-8 transition-transform hover:scale-105 hover:shadow-2xl"
        role="button"
        tabIndex={0}
        onKeyDown={() => navigate("/community/kidney")}
      >
        <h3 className="text-3xl font-semibold text-yellow-600 mb-4">Hemodialysis Patient Form</h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          If you are a kidney dialysis patient, fill out this form to be part of our support system for patients.
        </p>
      </div>

      {/* Community Cards Section */}
      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {/* Wanaw Community Membership */}
        <div
          onClick={() => navigate("/community/membership")}
          className="cursor-pointer rounded-3xl bg-green shadow-xl p-8 text-gold transition-transform hover:scale-105 hover:shadow-2xl"
          role="button"
          tabIndex={0}
          onKeyDown={() => navigate("/community/membership")}
        >
          <h3 className="text-2xl font-bold mb-3">Wanaw Membership</h3>
          <p className="text-gold text-lg leading-relaxed">
            Become a part of the Wanaw Community and access exclusive resources and opportunities to collaborate.
          </p>
        </div>

        {/* Diaspora Community */}
        <div
          onClick={() => navigate("/community/diaspora")}
          className="cursor-pointer rounded-3xl bg-[#D4AF37] shadow-xl p-8 text-[#1c2b21] transition-transform hover:scale-105 hover:shadow-2xl"
          role="button"
          tabIndex={0}
          onKeyDown={() => navigate("/community/diaspora")}
        >
          <h3 className="text-2xl font-bold mb-3">Diaspora Community</h3>
          <p className="text-[#1c2b21]text-lg leading-relaxed">
            Connect with fellow Ethiopians abroad and contribute to development efforts from wherever you are.
          </p>
        </div>

        {/* Support Community */}
        <div
          onClick={() => navigate("/community/support")}
          className="cursor-pointer rounded-3xl bg-green shadow-xl p-8 text-gold transition-transform hover:scale-105 hover:shadow-2xl"
          role="button"
          tabIndex={0}
          onKeyDown={() => navigate("/community/support")}
        >
          <h3 className="text-2xl font-bold mb-3">Support Community</h3>
          <p className="text-gold text-lg leading-relaxed">
            Join a network of volunteers, professionals, and contributors supporting our mission on the ground.
          </p>
        </div>
      </div>
    </div>
  );
}



