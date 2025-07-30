import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift as GiftIcon, ChevronDown, ChevronUp } from "lucide-react";

import BASE_URL from "../../api/api";

type Recipient = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
};

const SendGiftForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { occasion, service } = (state || {}) as {
    occasion?: { _id: string; title: string; category: string };
    service?: {
      _id: string;
      title: string;
      price?: number;
      description?: string;
      provider?: { name: string; email?: string; phone?: string; whatsapp?: string; telegram?: string };
      imageUrl?: File;
    };
  };

  if (!service) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">No service selected.</p>
        <button onClick={() => navigate(-1)} className="bg-[#1c2b21] text-white px-4 py-2 rounded">
          Go Back
        </button>
      </div>
    );
  }

  const isLoggedIn = !!localStorage.getItem("user");
  const [senderNameInput, setSenderNameInput] = useState("");
  const [senderEmailInput, setSenderEmailInput] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      const saved = JSON.parse(localStorage.getItem("guestSender") || "{}");
      setSenderNameInput(saved.name || "");
      setSenderEmailInput(saved.email || "");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("guestSender", JSON.stringify({ name: senderNameInput, email: senderEmailInput }));
    }
  }, [senderNameInput, senderEmailInput, isLoggedIn]);

  const [recipients, setRecipients] = useState<Recipient[]>([
    { name: "", email: "", phone: "", whatsapp: "", telegram: "" },
  ]);

  const [message, setMessage] = useState("");
  const [notifyProvider, setNotifyProvider] = useState(false);
  const [providerMessage, setProviderMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const senderName = loggedInUser?.fullName || senderNameInput || "Anonymous";
  const senderEmail = loggedInUser?.email || senderEmailInput;

  const handleRecipientChange = (
    index: number,
    field: keyof Recipient,
    value: string
  ) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const notifyAllChannels = async (deliveryCode: string, recipient: Recipient) => {
    const payload = {
      buyerName: senderName,
      buyerEmail: senderEmail,
      recipientEmail: recipient.email || "",
      recipientPhone: recipient.phone || "",
      recipientWhatsApp: recipient.whatsapp || "",
      recipientTelegram: recipient.telegram || "",
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

    await fetch(`${BASE_URL}/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handlePayAndSend = async () => {
    if (!recipients.some(r => r.email || r.phone || r.whatsapp || r.telegram)) {
      alert("Please enter at least one recipient contact.");
      return;
    }
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

      const purchaseRes = await fetch(`${BASE_URL}/services/${service._id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchasePayload),
      });

      if (!purchaseRes.ok) throw new Error("Failed to register gift");

      let successfulRecipients = 0;

      for (const recipient of recipients) {
        try {
          const assignRes = await fetch(`${BASE_URL}/gift/${service._id}/assign-delivery-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipient, senderName, message, service }),
          });

          if (!assignRes.ok) {
            console.warn("Failed to assign delivery code to:", recipient);
            continue;
          }

          const { code: deliveryCode } = await assignRes.json();
          await notifyAllChannels(deliveryCode, recipient);
          successfulRecipients++;
        } catch (err) {
          console.error("Error assigning or notifying recipient:", err);
        }
      }

      if (successfulRecipients === 0) {
        alert("❌ Failed to send gift. Please check recipient details.");
        return;
      }

      alert("🎉 Gift sent and purchase recorded!");

      const totalAmount = (service.price || 0) * successfulRecipients;

      console.log("Navigating to payment-options with:", {
        service,
        senderName,
        senderEmail,
        amount: totalAmount,
        recipients,
        occasion,
        notifyProvider,
        providerMessage,
      });

      navigate("/payment-options", {
        state: {
          service,
          senderName,
          senderEmail,
          amount: totalAmount,
          recipients,
          occasion,
          notifyProvider,
          providerMessage,
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
          <div className="text-sm text-gray-600 mb-6">
            <p>Occasion: <span className="font-medium">{occasion.title}</span></p>
            <p>Category: <span className="text-[#1c2b21] font-semibold">{occasion.category}</span></p>
          </div>
        )}

        {!isLoggedIn && (
          <>
            <input
              type="text"
              placeholder="Your Name"
              value={senderNameInput}
              onChange={(e) => setSenderNameInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="email"
              placeholder="Your Email (required)"
              value={senderEmailInput}
              onChange={(e) => setSenderEmailInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
          </>
        )}

        {recipients.map((r, index) => (
          <div key={index} className="mb-6 border p-4 rounded bg-gray-50">
            <input type="text" placeholder="Recipient Name" value={r.name} onChange={(e) => handleRecipientChange(index, "name", e.target.value)} className="w-full p-2 border mb-2 rounded" />
            <input type="email" placeholder="Recipient Email" value={r.email} onChange={(e) => handleRecipientChange(index, "email", e.target.value)} className="w-full p-2 border mb-2 rounded" />
            <input type="tel" placeholder="Phone" value={r.phone} onChange={(e) => handleRecipientChange(index, "phone", e.target.value)} className="w-full p-2 border mb-2 rounded" />
            <input type="tel" placeholder="WhatsApp" value={r.whatsapp} onChange={(e) => handleRecipientChange(index, "whatsapp", e.target.value)} className="w-full p-2 border mb-2 rounded" />
            <input type="text" placeholder="Telegram" value={r.telegram} onChange={(e) => handleRecipientChange(index, "telegram", e.target.value)} className="w-full p-2 border mb-2 rounded" />
          </div>
        ))}

        <button
          type="button"
          className="bg-[#1c2b21] text-white px-4 py-1 mb-4 rounded"
          onClick={() => setRecipients([...recipients, { name: "", email: "", phone: "", whatsapp: "", telegram: "" }])}
        >
          ➕ Add Another Recipient
        </button>

        <label className="block mb-2 font-medium text-[#1c2b21]">Preferred Service Date</label>
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
        />

        <textarea
          placeholder="Add a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 resize-none"
        />

        {service.provider && (
          <div className="mb-6 border-t pt-4">
            <button
              type="button"
              onClick={() => setNotifyProvider((v) => !v)}
              className="flex items-center text-sm font-medium text-[#1c2b21] mb-2"
            >
              {notifyProvider ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              Notify {service.provider.name}
            </button>

            {notifyProvider && (
              <textarea
                placeholder="Message to the service provider (optional)"
                value={providerMessage}
                onChange={(e) => setProviderMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
            )}
          </div>
        )}

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




