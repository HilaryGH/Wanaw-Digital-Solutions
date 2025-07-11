import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const SelectMembership = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Redirect to login if token is missing
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/login");
    }
  }, [token, navigate]);

  const membershipPrices: Record<string, number> = {
  basic: 200,
  premium: 500,
  enterprise: 1000,
};

const handleSubmit = async () => {
  if (!selected) {
    alert("Please select a membership plan.");
    return;
  }

  const amount = membershipPrices[selected];
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/payment/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "ETB",
        email: user?.email,
        first_name: user?.firstName || user?.fullName || "User",
        last_name: "Membership",
        tx_ref: `membership-${Date.now()}`,
        return_url: `${window.location.origin}/payment/success?plan=${selected}`,
        customization: {
          title: `Purchase ${selected} Plan`,
          description: `Membership payment for ${selected}`,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.checkout_url) {
      throw new Error("Payment initialization failed.");
    }

    window.location.href = data.checkout_url; // redirect to chapa
  } catch (err) {
    console.error(err);
    alert("Failed to initiate Chapa payment");
  }
};


  return (
    <div className="p-6 bg-white rounded shadow w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Select Membership Plan</h2>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full p-2 border mb-4"
      >
        <option value="">-- Choose Plan --</option>
        <option value="basic">Basic</option>
        <option value="premium">Premium</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <button
        onClick={handleSubmit}
        className="w-full bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 rounded"
      >
        Update Membership
      </button>
    </div>
  );
};

export default SelectMembership;
