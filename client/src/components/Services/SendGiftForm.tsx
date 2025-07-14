import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift as GiftIcon } from "lucide-react";
import BASE_URL from "../../api/api";

type Service = {
  _id: string;
  title: string;
  price?: number;
  description?: string;
};

type Occasion = {
  _id: string;
  title: string;
  category: string;
};

const SendGiftForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { occasion, service } = (location.state || {}) as {
    occasion?: Occasion;
    service?: Service;
  };

  if (!service) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">No service selected.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#1c2b21] text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientWhatsApp, setRecipientWhatsApp] = useState("");
  const [message, setMessage] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const senderName = user?.fullName || "Anonymous";

  const handlePayAndSend = async () => {
    if (!recipientEmail && !recipientPhone && !recipientWhatsApp) {
      alert("Please enter at least one recipient contact: Email, Phone or WhatsApp.");
      return;
    }

    const pending = {
      recipientEmail,
      recipientPhone,
      recipientWhatsApp,
      message,
      senderName,
      occasion,
      service,
    };
    localStorage.setItem("pendingGift", JSON.stringify(pending));

    try {
      const res = await fetch(`${BASE_URL}/payment/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: service.price ?? 0,
          email: recipientEmail,
          phone_number: recipientPhone,
          whatsapp_number: recipientWhatsApp,
          first_name: "Gift",
          last_name: "Receiver",
          serviceId: service._id,
          occasionId: occasion?._id,
        }),
      });

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Payment initiation failed.");
      }
    } catch (err) {
      alert("Payment error.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-10">
      <div className="p-6 sm:p-8">
        <h2 className="flex items-center text-2xl font-bold mb-4 text-[#1c2b21]">
          <GiftIcon className="w-6 h-6 mr-2 text-[#D4AF37]" />
          Send “{service.title}”
        </h2>
        {occasion && (
          <p className="text-sm text-gray-600 mb-6">
            Occasion:&nbsp;<span className="font-medium">{occasion.title}</span>
          </p>
        )}

        <input
          type="email"
          placeholder="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        <input
          type="tel"
          placeholder="Recipient Phone Number"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        <input
          type="tel"
          placeholder="Recipient WhatsApp Number"
          value={recipientWhatsApp}
          onChange={(e) => setRecipientWhatsApp(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        <textarea
          placeholder="Add a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 resize-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        {service.price !== undefined && (
          <p className="text-right text-gray-700 mb-4">
            <span className="font-semibold">Total:</span>{" "}
            {service.price.toLocaleString()} ETB
          </p>
        )}

        <button
          onClick={handlePayAndSend}
          className="w-full bg-[#1c2b21] text-white py-2 rounded hover:bg-[#151e18] transition"
        >
          Pay &amp; Send Gift
        </button>
      </div>
    </div>
  );
};

export default SendGiftForm;



