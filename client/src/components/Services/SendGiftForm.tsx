import { useState, useEffect } from "react";
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
  imageUrl?: File;
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

  const isLoggedIn = !!localStorage.getItem("user");
  const [senderNameInput, setSenderNameInput] = useState("");
  const [senderEmailInput, setSenderEmailInput] = useState("");

  // Load saved guest sender info if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = JSON.parse(localStorage.getItem("guestSender") || "{}");
      setSenderNameInput(saved.name || "");
      setSenderEmailInput(saved.email || "");
    }
  }, [isLoggedIn]);

  // Save guest sender info whenever it changes
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem(
        "guestSender",
        JSON.stringify({ name: senderNameInput, email: senderEmailInput })
      );
    }
  }, [senderNameInput, senderEmailInput, isLoggedIn]);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientWhatsApp, setRecipientWhatsApp] = useState("");
  const [recipientTelegram, setRecipientTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [notifyProvider, setNotifyProvider] = useState(false);
  const [providerMessage, setProviderMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [recipientName, setRecipientName] = useState("");


  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const senderName = loggedInUser?.fullName || senderNameInput || "Anonymous";
  const senderEmail = loggedInUser?.email || senderEmailInput;

  /* ───── Notify via Backend ───── */
  const notifyAllChannels = async (deliveryCode: string) => {

    try {
      const payload = {
        buyerName: senderName,
        buyerEmail: senderEmail,
        recipientEmail,
        recipientPhone,
        recipientWhatsApp,
        recipientTelegram,
        message,
        senderName,
        serviceTitle: service.title,
        occasionTitle: occasion?.title || "",
        serviceImageUrl: service.imageUrl,
        notifyProvider,
        providerMessage,
        providerContact: service.provider,
        deliveryDate,
          deliveryCode,
      };

      const res = await fetch(`${BASE_URL}/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Notification API Error:", res.status, errorText);
        throw new Error(`Notification failed with status ${res.status}`);
      }
    } catch (err) {
      console.error("Notification failed:", err);
    }
  };

  /* ───── Main Action ───── */
  const handlePayAndSend = async () => {
    // Validate recipient contact
    if (
      !recipientEmail &&
      !recipientPhone &&
      !recipientWhatsApp &&
      !recipientTelegram
    ) {
      alert("Please enter at least one recipient contact.");
      return;
    }

    // Validate sender email if guest
    if (!isLoggedIn && !senderEmailInput) {
      alert("Please enter your email.");
      return;
    }

    try {
      const purchasePayload = {
        buyerName: senderName,
        buyerEmail: senderEmail,
        deliveryDate,
      };

      const purchaseRes = await fetch(
        `${BASE_URL}/services/${service._id}/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchasePayload),
        }
      );

      if (!purchaseRes.ok) {
        const error = await purchaseRes.text();
        console.error("❌ Purchase API error:", purchaseRes.status, error);
        alert("Failed to register the gift. Please try again.");
        return;
      }
      // Generate 4-digit random code
const recipientPayload = {
  name: recipientName || recipientEmail || recipientPhone || "Unnamed Recipient",
  email: recipientEmail || "",
  phone: recipientPhone || "",
  whatsapp: recipientWhatsApp || "",
  telegram: recipientTelegram || "",
};

const assignRes = await fetch(`${BASE_URL}/gift/${service._id}/assign-delivery-code`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ recipient: recipientPayload }),
});


if (!assignRes.ok) {
  const errText = await assignRes.text();
  console.error("❌ Assign code failed:", assignRes.status, errText);
  alert("Failed to assign delivery code.");
  return;
}

const { code: deliveryCode } = await assignRes.json();

      localStorage.setItem(
        "pendingGift",
        JSON.stringify({
          recipientEmail,
          recipientPhone,
          recipientWhatsApp,
          recipientTelegram,
          message,
          senderName,
          senderEmail,
          occasion,
          service,
          notifyProvider,
          providerMessage,
          deliveryCode,
        })
      );
      // Step 2: Send notifications
      await notifyAllChannels(deliveryCode);


      alert("🎉 Gift sent and purchase recorded!");
      navigate("/payment-options", {
        state: {
          service,
          senderName,
          senderEmail,
          amount: service.price,
        },
      });
    } catch (error) {
      console.error("Send gift error:", error);
      alert("❌ Something went wrong while sending the gift.");
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
            Occasion:&nbsp;
            <span className="font-medium">{occasion.title}</span>
          </p>
        )}

        {!isLoggedIn && (
          <>
            <input
              type="text"
              placeholder="Your Name"
              value={senderNameInput}
              onChange={(e) => setSenderNameInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
            />
            <input
              type="email"
              placeholder="Your Email (required)"
              value={senderEmailInput}
              onChange={(e) => setSenderEmailInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
              required
            />
          </>
        )}

<input
  type="text"
  placeholder="Recipient Name"
  value={recipientName}
  onChange={(e) => setRecipientName(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#D4AF37] outline-none"
/>

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

        <label className="block mb-2 font-medium text-[#1c2b21]">Delivery Date</label>
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-[#D4AF37] outline-none"
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
            <span className="font-semibold">Total:</span> {service.price.toLocaleString()} ETB
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






