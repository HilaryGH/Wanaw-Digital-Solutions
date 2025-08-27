import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift as GiftIcon, ChevronDown, ChevronUp } from "lucide-react";

import BASE_URL from "../../api/api";

/* ----------------------------- Types ----------------------------- */
type Recipient = {
  name: string;
  email: string;
   phone?: string;
  profileImage?: File | string; // ✅ union, not string & File
  whatsapp: string;
  telegram: string;
   type: "standard" | "vip"; // only these two options
   photo?: string | File | null; // <-- allow null
};


type LocationState = {
  occasion?: { _id: string; title: string; category: string };
  service: {
    _id: string;
    title: string;
    price?: number;
    location?: string;
    description?: string;
    provider?: {
      name: string;
      email?: string;
      phone?: string;
      whatsapp?: string;
      telegram?: string;
    };
    imageUrl?: File | string;
    category?: string;
  };
};

type AvailabilityPayload = {
  serviceId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guests: number;
  roomPref?: string;
  contactEmail?: string;
  contactWhatsApp?: string;
  contactTelegram?: string;
};

type AvailabilityResponse = {
  status: "Available" | "Booked" | "Partial" | "Pending" | "Error";
  availableRooms?: number;
  message?: string;
  ticketId?: string; // when request routed to support
};

const hotelRoomSubcategories = [
  {
    label: "3 Star Hotel",
    options: [
      "Standard Room",
      "Deluxe Room",
      "Twin Room",
      "Suit Room",
      "Royal Suite Room",
    ],
  },
  {
    label: "4 Star Hotel",
    options: [
      "Standard Room",
      "Deluxe Room",
      "Twin Room",
      "Suit Room",
      "Royal Suite Room",
    ],
  },
  {
    label: "5 Star Hotel",
    options: [
      "Standard Room",
      "Deluxe Room",
      "Twin Room",
      "Suit Room",
      "Royal Suite Room",
      "Presidential Room",
    ],
  },
  {
    label: "Pensions",
    options: ["Standard Pension Room"],
  },
];
/* ------------------------- Helper utilities ------------------------ */
function parseDateAsLocal(dateString: string) {
  // dateString expected as YYYY-MM-DD
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function calcNights(checkIn: string, checkOut: string) {
  const inDate = parseDateAsLocal(checkIn);
  const outDate = parseDateAsLocal(checkOut);
  const diff = outDate.getTime() - inDate.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1;
}

/* ------------------------ Component ------------------------ */
const SendGiftForm: React.FC = () => {
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  const { occasion, service } = state || {};

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

  /* ---------------------- Auth / Sender ---------------------- */
  const isLoggedIn = !!localStorage.getItem("user");
  const [senderNameInput, setSenderNameInput] = useState("");
  const [senderEmailInput, setSenderEmailInput] = useState("");
  

  useEffect(() => {
    if (!isLoggedIn) {
      try {
        const saved = JSON.parse(localStorage.getItem("guestSender") || "{}");
        setSenderNameInput(saved.name || "");
        setSenderEmailInput(saved.email || "");
      } catch (e) {
        // ignore
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem(
        "guestSender",
        JSON.stringify({ name: senderNameInput, email: senderEmailInput })
      );
    }
  }, [senderNameInput, senderEmailInput, isLoggedIn]);

  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  })();

  const senderName = loggedInUser?.fullName || senderNameInput || "Anonymous";
  const senderEmail = loggedInUser?.email || senderEmailInput || "";

  /* ------------------ Recipients + Gift data ------------------ */
const [recipients, setRecipients] = useState<Recipient[]>([
  { name: "", email: "", phone: "", whatsapp: "", telegram: "", type: "standard", photo: null }
]);


  const [message, setMessage] = useState("");
  const [notifyProvider, setNotifyProvider] = useState(false);
  const [providerMessage, setProviderMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  /* ------------------ Hotel availability states ------------------ */
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [guests] = useState<number>(1);
  const [roomPref, setRoomPref] = useState<string>("Any");

  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactWhatsApp, setContactWhatsApp] = useState<string>("");
  const [contactTelegram, setContactTelegram] = useState<string>("");

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [proceedAnyway, setProceedAnyway] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");


  const [nights, setNights] = useState<number>(1);

  /* Calculate nights whenever dates change */
  useEffect(() => {
    if (service.category === "Hotel Rooms" && checkInDate && checkOutDate) {
      const days = calcNights(checkInDate, checkOutDate);
      setNights(days);
    }
  }, [checkInDate, checkOutDate, service.category]);

  /* ------------------ Handlers ------------------ */
 const handleRecipientChange = (
  index: number,
  field: keyof Recipient,
  value: string | File // ✅ allow both
) => {
  const updated = [...recipients];
  updated[index][field] = value as any; // or narrow by field if needed
  setRecipients(updated);
};


  async function handleCheckAvailability() {
    setAvailabilityError(null);

    if (!checkInDate || !checkOutDate) {
      setAvailabilityError("Please select check-in and check-out dates.");
      return;
    }

    if (!contactEmail && !contactWhatsApp && !contactTelegram) {
      setAvailabilityError("Please provide at least one contact (email/WhatsApp/Telegram).");
      return;
    }

    // Basic date validity
    const inDate = parseDateAsLocal(checkInDate);
    const outDate = parseDateAsLocal(checkOutDate);
    if (outDate <= inDate) {
      setAvailabilityError("Check-out date must be after check-in date.");
      return;
    }

    setCheckingAvailability(true);


// prepare payload for availability
const payload: AvailabilityPayload = {
  serviceId: service._id,
  checkInDate,
  checkOutDate,
  guests,
  roomPref,
  contactEmail,
  contactWhatsApp,
  contactTelegram,
};


    try {
      const res = await fetch(`${BASE_URL}/hotel/check-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 404) {
        // API not implemented — fallback to support ticket
        const supportRes = await fetch(`${BASE_URL}/support/availability-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, senderName, senderEmail }),
        });

        if (supportRes.ok) {
          const data = await supportRes.json();
          setAvailability({
            status: "Pending",
            ticketId: data.ticketId || undefined,
            message:
              "We couldn't check availability automatically. Your request has been forwarded to Customer Support.",
          });
        } else {
          setAvailability({
            status: "Pending",
            message:
              "We couldn't check availability automatically and failed to send the request to support. Please try again later.",
          });
        }

        setCheckingAvailability(false);
        return;
      }

      if (!res.ok) {
        // server error
        setAvailability({ status: "Error", message: "Failed to check availability." });
        setCheckingAvailability(false);
        return;
      }

      const data = await res.json();
      // Expecting response with { status: 'Available'|'Booked'|'Partial', availableRooms?, message? }
      setAvailability({
        status: data.status || "Error",
        availableRooms: data.availableRooms,
        message: data.message,
      });
    } catch (err) {
      console.error(err);
      // Network error -> fallback to support ticket submission
      try {
        const supportRes = await fetch(`${BASE_URL}/support/availability-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, senderName, senderEmail }),
        });
        if (supportRes.ok) {
          const d = await supportRes.json();
          setAvailability({
            status: "Pending",
            ticketId: d.ticketId || undefined,
            message: "Network error — we forwarded your request to Customer Support.",
          });
        } else {
          setAvailability({ status: "Error", message: "Network error and failed to contact support." });
        }
      } catch (e) {
        setAvailability({ status: "Error", message: "Network error and failed to contact support." });
      }
    } finally {
      setCheckingAvailability(false);
    }
  }

  /* Reuse notifyAllChannels from your original logic (slightly adapted) */
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

      provider: service.provider?.name || "",
      location: service?.location || "",
      giftCode: deliveryCode,
      deliveryDate,

      serviceId: service._id,

      checkInDate: service.category === "Hotel Rooms" ? checkInDate : undefined,
      checkOutDate: service.category === "Hotel Rooms" ? checkOutDate : undefined,
      nights: service.category === "Hotel Rooms" ? nights : undefined,
    };

    try {
      await fetch(`${BASE_URL}/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("notifyAllChannels error:", e);
    }
  };

  /* ------------------ Main purchase + send ------------------ */
const handlePayAndSend = async () => {
  // --- Hotel validation ---
  if (service.category === "Hotel Rooms") {
    if (!availability || (availability.status !== "Available" && !proceedAnyway)) {
      alert(
        "Please check room availability first and ensure rooms are available. You can override by checking 'Proceed anyway', but that's at your own risk."
      );
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
  }

  // --- Recipient and sender validation ---
  if (!recipients.some((r) => r.email || r.phone || r.whatsapp || r.telegram)) {
    alert("Please enter at least one recipient contact.");
    return;
  }

  if (!isLoggedIn && !senderEmailInput) {
    alert("Please enter your email.");
    return;
  }

  try {
    // --- Prepare FormData for file upload ---
    const formData = new FormData();
    formData.append("buyerName", senderName);
    formData.append("buyerEmail", senderEmail);
    formData.append("deliveryDate", deliveryDate);
    formData.append("message", message);
    formData.append("serviceId", service._id);

    if (service.category === "Hotel Rooms") {
      formData.append("checkInDate", checkInDate);
      formData.append("checkOutDate", checkOutDate);
      formData.append("nights", nights.toString());
    }

    recipients.forEach((r, i) => {
      formData.append(`recipients[${i}][name]`, r.name);
      formData.append(`recipients[${i}][email]`, r.email);
      formData.append(`recipients[${i}][phone]`, r.phone || "");
      formData.append(`recipients[${i}][whatsapp]`, r.whatsapp || "");
      formData.append(`recipients[${i}][telegram]`, r.telegram || "");
      formData.append(`recipients[${i}][type]`, r.type);
      if (r.type === "vip" && r.photo instanceof File) {
        formData.append(`recipients[${i}][photo]`, r.photo); // actual file upload
      }
    });

    if (referralCode) {
      formData.append("referralCode", referralCode);
    }

    // --- Send purchase request ---
    const purchaseRes = await fetch(`${BASE_URL}/services/${service._id}/purchase`, {
      method: "POST",
      body: formData, // 👈 FormData handles files
    });

    if (!purchaseRes.ok) {
      const errorData = await purchaseRes.json();
      console.error("Purchase failed:", errorData);
      alert(`❌ Failed to send gift: ${errorData.message || purchaseRes.statusText}`);
      return;
    }

    const { codes: deliveryCodes } = await purchaseRes.json();

    // --- Notify recipients ---
    for (let i = 0; i < recipients.length; i++) {
      try {
        await notifyAllChannels(deliveryCodes[i], recipients[i]);
      } catch (err) {
        console.error("Error notifying recipient:", recipients[i], err);
      }
    }

    alert("🎉 Gift sent and purchase recorded!");

    const totalAmount = (service.price || 0) * (service.category === "Hotel Rooms" ? nights : 1) * recipients.length;

    // --- Navigate to payment options ---
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

  /* ------------------ Render ------------------ */
  const hotelCategory = service.category === "Hotel Rooms";
  const availabilityVerified = availability?.status === "Available";

  const totalAmount = service.price
  ? (service.price * (hotelCategory ? nights : 1) * recipients.length)
  : 0;


  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-10">
      <div className="p-6 sm:p-8">
        <h2 className="flex items-center text-2xl font-bold mb-4 text-[#1c2b21]">
          <GiftIcon className="w-6 h-6 mr-2 text-[#D4AF37]" />
          Send “{service.title}”
        </h2>

        {occasion && (
          <div className="text-sm text-gray-600 mb-6">
            <p>
              Occasion: <span className="font-medium">{occasion.title}</span>
            </p>
            <p>
              Category:{" "}
              <span className="text-[#1c2b21] font-semibold">{occasion.category}</span>
            </p>
          </div>
        )}

        {/* ---------------------- Availability step (hotel only) ---------------------- */}
        {hotelCategory && !availabilityVerified && !proceedAnyway && (
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h3 className="font-semibold mb-3 text-[#1c2b21]">Step 1 — Check Room Availability</h3>

            <label className="block mb-2 font-medium text-[#1c2b21]">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />

            <label className="block mb-2 font-medium text-[#1c2b21]">Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />


            <label className="block mb-2 font-medium text-[#1c2b21]">Room Preference</label>
<select
  value={roomPref}
  onChange={(e) => setRoomPref(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
>
  <option value="">Any</option>
  {hotelRoomSubcategories.map((category, idx) => (
    <optgroup key={idx} label={category.label}>
      {category.options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </optgroup>
  ))}
</select>


            <p className="mt-2 mb-2 text-sm text-gray-600">Contact (so we can notify you):</p>
            <input
              type="email"
              placeholder="Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 mb-2 rounded"
            />
            <input
              type="tel"
              placeholder="WhatsApp"
              value={contactWhatsApp}
              onChange={(e) => setContactWhatsApp(e.target.value)}
              className="w-full p-2 border border-gray-300 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Telegram"
              value={contactTelegram}
              onChange={(e) => setContactTelegram(e.target.value)}
              className="w-full p-2 border border-gray-300 mb-4 rounded"
            />

            {availabilityError && <p className="text-red-600 mb-2">{availabilityError}</p>}

            {availability && (
              <div className="p-3 mb-4 rounded border bg-white">
                <p className="font-medium">Status: {availability.status}</p>
                {availability.availableRooms !== undefined && (
                  <p>{availability.availableRooms} rooms available.</p>
                )}
                {availability.message && <p className="text-sm">{availability.message}</p>}
                {availability.ticketId && <p className="text-sm">Ticket: {availability.ticketId}</p>}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="bg-[#1c2b21] text-white px-4 py-2 rounded"
              >
                {checkingAvailability ? "Checking..." : "Check Availability"}
              </button>

              <label className="flex items-center text-sm gap-2">
                <input
                  type="checkbox"
                  checked={proceedAnyway}
                  onChange={(e) => setProceedAnyway(e.target.checked)}
                />
                Proceed anyway (I understand availability may not be confirmed)
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Note: If automatic checking is not available, your request will be forwarded to customer support and
              they will contact you.
            </p>
          </div>
        )}

        {/* ---------------------- Gift form (rendered once availability is OK or not a hotel) ---------------------- */}
        {(!hotelCategory || availabilityVerified || proceedAnyway) && (
          <div>
            {/* Sender inputs for guests (when not logged in) */}
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
    {/* Recipient Type (Standard / VIP) */}
    <select
      value={r.type || "standard"}
      onChange={(e) => handleRecipientChange(index, "type", e.target.value)}
      className="w-full p-2 border border-gray-300 mb-2 rounded"
    >
      <option value="standard">Standard Gift </option>
      <option value="vip">VIP Gift</option>
    </select>

    <input
      type="text"
      placeholder="Recipient Name"
      value={r.name}
      onChange={(e) => handleRecipientChange(index, "name", e.target.value)}
      className="w-full p-2 border border-gray-300 mb-2 rounded"
    />
    <input
      type="email"
      placeholder="Recipient Email"
      value={r.email}
      onChange={(e) => handleRecipientChange(index, "email", e.target.value)}
      className="w-full p-2 border border-gray-300 mb-2 rounded"
    />
    <input
      type="tel"
      placeholder="Phone"
      value={r.phone}
      onChange={(e) => handleRecipientChange(index, "phone", e.target.value)}
      className="w-full p-2 border border-gray-300 mb-2 rounded"
    />
    <input
      type="tel"
      placeholder="WhatsApp"
      value={r.whatsapp}
      onChange={(e) => handleRecipientChange(index, "whatsapp", e.target.value)}
      className="w-full p-2 border border-gray-300 mb-2 rounded"
    />
    <input
      type="text"
      placeholder="Telegram"
      value={r.telegram}
      onChange={(e) => handleRecipientChange(index, "telegram", e.target.value)}
      className="w-full p-2 border border-gray-300 mb-2 rounded"
    />

    {/* If VIP, show photo upload */}
    {r.type === "vip" && (
      <div className="mt-2">
        <label className="block mb-2 font-medium text-[#1c2b21]">
          Upload Photo (VIP only)
        </label>
   <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleRecipientChange(index, "photo", file);
  }}
  className="w-full p-2 border border-gray-300 rounded"
/>


      </div>
    )}
  </div>
))}

<button
  type="button"
  className="bg-[#1c2b21] text-white px-4 py-1 mb-4 rounded"
  onClick={() =>
    setRecipients([
      ...recipients,
      {
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        telegram: "",
        type: "standard", // default
        photo: null,
      },
    ])
  }
>
  ➕ Add Another Recipient
</button>




            {/* Conditional date inputs */}
            {service.category === "Hotel Rooms" ? (
              <>
                <label className="block mb-2 font-medium text-[#1c2b21]">Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />

                <label className="block mb-2 font-medium text-[#1c2b21]">Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-6"
                />

                <label className="block mb-2 font-medium text-[#1c2b21]">Number of Nights</label>
                <input
                  type="number"
                  min={1}
                  value={nights}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg mb-6 bg-gray-100 cursor-not-allowed"
                />
              </>
            ) : (
              <>
                <label className="block mb-2 font-medium text-[#1c2b21]">Preferred Service Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-6"
                />
              </>
            )}

            {/* Main Message Section (recipient message, restricted if VIP) */}
<textarea
  placeholder="Add a message (optional)"
  value={message}
  onChange={(e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (recipients.some((r) => r.type === "vip") && words.length > 20) {
      return; // prevent typing more than 20 words
    }
    setMessage(e.target.value);
  }}
  className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 resize-none"
/>

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
      <>
        {/* Separate message for provider */}
        <textarea
          placeholder="Message to the service provider (optional)"
          value={providerMessage}
          onChange={(e) => setProviderMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={4}
        />
      </>
    )}
  </div>
)}

              </div>
            )}

           {service.price !== undefined && (
  <p className="text-right text-gray-700 mb-4">
    <span className="font-semibold">Total:</span> {totalAmount.toLocaleString()} ETB
  </p>
)}
<label className="block mb-2 font-medium text-[#1c2b21]">
  Referral Code (optional)
</label>
<input
  type="text"
  placeholder="Enter referral code if you have one"
  value={referralCode}
  onChange={(e) => setReferralCode(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded-lg mb-6"
/>


           <button
  onClick={handlePayAndSend}
  disabled={hotelCategory && !availabilityVerified && !proceedAnyway}
  className="w-full bg-[#1c2b21] text-white py-2 rounded hover:bg-[#151e18] transition"
>
  Pay&nbsp;&amp;&nbsp;Send Gift
</button>

          </div>
        )
      </div>
  );
};

export default SendGiftForm;






