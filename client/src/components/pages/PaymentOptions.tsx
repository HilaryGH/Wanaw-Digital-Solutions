// src/pages/PaymentOptions.tsx
import { useLocation } from "react-router-dom";
import BASE_URL from "../../api/api";

const PaymentOptions = () => {
  const { state } = useLocation();
  const {
    service,
    recipientEmail,
    recipientPhone,
    recipientWhatsApp,
    occasion,
    notifyProvider = false,
    providerMessage = "",
  } = state || {};

  const handleChapaPayment = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const payload = {
      amount: service?.price || 0,
      email: recipientEmail || user.email || "",
      phone_number: recipientPhone || "",
      whatsapp_number: recipientWhatsApp || "",
      first_name: user.fullName?.split(" ")[0] || "User",
      last_name: user.fullName?.split(" ")[1] || "Wanaw",
      serviceId: service?._id,
      occasionId: occasion?._id || null,
      notifyProvider,
      providerMessage,
      providerContact: service?.provider || null,
    };

    try {
      const res = await fetch(`${BASE_URL}/payment/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        console.error("Chapa API error:", data);
        alert("❌ Failed to start Chapa payment.");
      }
    } catch (error) {
      console.error("Chapa payment error:", error);
      alert("Something went wrong during Chapa checkout.");
    }
  };

  const handleWalletPayment = () => {
    // Placeholder function – you can replace this with your own wallet logic
    alert("Wallet payment feature coming soon or under development.");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Choose Payment Method</h2>
      <p className="mb-2">
        For: <strong>{service?.title}</strong>
      </p>
      <p className="mb-4">
        Amount: <strong>{service?.price} ETB</strong>
      </p>

      <div className="grid gap-4">
        <button className="p-3 bg-green text-gold rounded">Pay with Telebirr</button>
        <button className="p-3 bg-green text-gold rounded">Pay with Bank Transfer</button>
        <button className="p-3 bg-green text-gold rounded">Pay with Card</button>
        <button className="p-3 bg-green text-gold rounded">Pay with Bank App</button>
        <button
          onClick={handleWalletPayment}
          className="p-3 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
        >
          Pay with Wallet
        </button>
        <button
          onClick={handleChapaPayment}
          className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Pay with Chapa
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;


