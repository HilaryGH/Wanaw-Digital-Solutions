import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SelectMembership = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL query parameter
  const params = new URLSearchParams(location.search);
  const roleParam = params.get("role");
  const role: "user" | "provider" = roleParam === "provider" ? "provider" : "user";

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/login");
    }
  }, [token, navigate]);

  const membershipOptions: Record<string, Record<string, number>> = {
    user: { standard: 200, gold: 500, premium: 1000 },
    provider: { basic: 300, Premium: 800 },
  };

  const handleProceed = () => {
    if (!selected) {
      alert("Please select a membership plan.");
      return;
    }

    // Navigate to PaymentOptions page with state or query params
    navigate(`/payment-options`, {
      state: { selectedPlan: selected, role, price: membershipOptions[role][selected] },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Brand Accent */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-spin-slow"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-gradient-to-tr from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-pulse"></div>

        <h2 className="text-2xl font-bold text-[#1c2b21] mb-6 text-center">
          Select Membership Plan
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {role === "user" ? "User Membership Options" : "Service Provider Membership Options"}
        </p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#1c2b21] transition mb-6 text-gray-700 font-medium"
        >
          <option value="">-- Choose Plan --</option>
          {Object.keys(membershipOptions[role]).map((plan) => (
            <option key={plan} value={plan}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)} — {membershipOptions[role][plan]} ETB
            </option>
          ))}
        </select>

        <button
          onClick={handleProceed}
          className="w-full bg-gradient-to-r from-[#1c2b21] to-[#3c4f3b] text-[#D4AF37] font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all"
        >
          Proceed to Payment
        </button>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Your payment is secure and will be processed safely.
        </p>
      </div>
    </div>
  );
};

export default SelectMembership;

