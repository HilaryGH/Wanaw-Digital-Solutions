import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Gift } from "lucide-react";
import BASE_URL from "../../api/api";

const SendGiftForm = () => {

  const location = useLocation();
  const service = location.state?.service;

  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  // Get the sender's name from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const senderName = user?.fullName || "";
  const handlePayAndSend = async () => {
    if (!recipient) {
      alert("Please enter recipient email");
      return;
    }

    // Save gift details temporarily to send after payment
    const giftDetails = {
      recipientEmail: recipient,
      message,
      service,
      senderName,
    };
    localStorage.setItem("pendingGift", JSON.stringify(giftDetails));

    try {
      const res = await fetch(`${BASE_URL}/payment/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: service.price,
          email: recipient,
          first_name: "Gift",
          last_name: "Receiver",
          phone_number: "0910000000",
          service,
        }),
      });

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Payment initiation failed");
      }
    } catch (err) {
      alert("Payment error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-10">
      <div className="p-6 sm:p-8">
        <h2 className="flex items-center text-2xl font-bold mb-6 text-[#1c2b21]">
          <Gift className="w-6 h-6 mr-2 text-[#D4AF37]" />
          Send “{service.title}” as Gift
        </h2>

        <input
          type="email"
          placeholder="Recipient email *"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
          required
        />

        <textarea
          placeholder="Add a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 resize-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        <button
          onClick={handlePayAndSend}
          className="w-full bg-[#1c2b21] text-white py-2 rounded"
        >
          Pay & Send Gift
        </button>
      </div>
    </div>
  );
};

export default SendGiftForm;
