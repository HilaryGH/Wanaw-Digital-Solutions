import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift as GiftIcon, ChevronDown, ChevronUp } from "lucide-react";
import BASE_URL from "../../api/api";

/* ───────────── Type Definitions ───────────── */
type ProviderContact = {
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
};

type Service = {
  _id: string;
  title: string;
  price?: number;
  description?: string;
  provider?: ProviderContact;
};

type Occasion = {
  _id: string;
  title: string;
  category: string;
};

/* ───────────── Component ───────────── */
const SendGiftForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { occasion, service } = (state || {}) as {
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

  /* —— Form State —— */
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientWhatsApp, setRecipientWhatsApp] = useState("");
  const [recipientTelegram, setRecipientTelegram] = useState("");
  const [message, setMessage] = useState("");

  const [notifyProvider, setNotifyProvider] = useState(false);
  const [providerMessage, setProviderMessage] = useState("");

  const senderName =
    JSON.parse(localStorage.getItem("user") || "null")?.fullName ||
    "Anonymous";

  /* —— Notify helper —— */
  const fireNotifications = async () => {
    const payload = {
      recipientEmail,
      recipientPhone,
      recipientWhatsApp,
      recipientTelegram,
      message,
      senderName,
      occasion,
      service,
      notifyProvider,
      providerMessage,
    };

    try {
      const res = await fetch(`${BASE_URL}/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) console.warn("Notification failure", await res.text());
    } catch (e) {
      console.error("Notification error:", e);
    }
  };

  /* —— Main submit —— */
  const handlePayAndSend = async () => {
    if (
      !recipientEmail &&
      !recipientPhone &&
      !recipientWhatsApp &&
      !recipientTelegram
    ) {
      alert(
        "Please enter at least one recipient contact: Email, Phone, WhatsApp or Telegram."
      );
      return;
    }

    /* Save to localStorage in case user refreshes during payment */
    localStorage.setItem(
      "pendingGift",
      JSON.stringify({
        recipientEmail,
        recipientPhone,
        recipientWhatsApp,
        recipientTelegram,
        message,
        senderName,
        occasion,
        service,
        notifyProvider,
        providerMessage,
      })
    );

    /* Kick off notifications (don’t block on them) */
    const notifyPromise = fireNotifications();

try {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/payment/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      amount: service.price ?? 0,
      email: recipientEmail,
      phone_number: recipientPhone,
      whatsapp_number: recipientWhatsApp,
      telegram: recipientTelegram,
      first_name: "Gift",
      last_name: "Receiver",
      serviceId: service._id,
      occasionId: occasion?._id,
      notifyProvider,
      providerMessage,
      providerContact: service.provider,
    }),
  });

  const data = await res.json();

  // Regardless of payment success or failure, notify recipient
  await fetch(`${BASE_URL}/notifications/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      recipientEmail,
      recipientPhone,
      recipientWhatsApp,
      recipientTelegram,
      message,
      senderName,
      serviceTitle: service.title,
      occasionTitle: occasion?.title || "",
      notifyProvider,
      providerMessage,
      providerContact: service.provider,
    }),
  });

  if (data.checkout_url) {
    window.location.href = data.checkout_url;
  } else {
    alert("Payment failed, but gift was still sent.");
  }
} catch (err) {
  alert("Payment failed, but gift was still sent.");
  console.error(err);
}

  };

  /* —— JSX —— */
  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-10">
      <div className="p-6 sm:p-8">
        <h2 className="flex items-center text-2xl font-bold mb-4 text-[#1c2b21]">
          <GiftIcon className="w-6 h-6 mr-2 text-[#D4AF37]" />
          Send “{service.title}”
        </h2>

        {occasion && (
          <p className="text-sm text-gray-600 mb-6">
            Occasion:&nbsp;
            <span className="font-medium">{occasion.title}</span>
          </p>
        )}

        {/* —— Recipient contacts —— */}
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

        <input
          type="text"
          placeholder="Recipient Telegram Username"
          value={recipientTelegram}
          onChange={(e) => setRecipientTelegram(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        <textarea
          placeholder="Add a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 resize-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />

        {/* —— Optional provider note —— */}
        {service.provider && (
          <div className="mb-6 border-t pt-4">
            <button
              type="button"
              onClick={() => setNotifyProvider((v) => !v)}
              className="flex items-center text-sm font-medium text-[#1c2b21] mb-2"
            >
              {notifyProvider ? (
                <ChevronUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              Notify {service.provider.name}
            </button>

            {notifyProvider && (
              <textarea
                placeholder="Message to the service provider (optional)"
                value={providerMessage}
                onChange={(e) => setProviderMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
                rows={4}
              />
            )}
          </div>
        )}

        {/* —— Summary + action —— */}
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
          Pay&nbsp;&amp;&nbsp;Send Gift
        </button>
      </div>
    </div>
  );
};

export default SendGiftForm;






