import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../../api/api";
import DownloadableInvoice from "../Services/DownloadableInvoice";
import BasicGiftCard from "../BasicGiftCard";
import VipGiftCard from "../VipGiftCard";

const PaymentOptions = () => {
  const { state } = useLocation();

  const { service, recipients = [], amount, senderName } = state || {};

  const [giftCode, setGiftCode] = useState<string | null>(null);

  const isGiftPayment = recipients.length > 0;

  const buyerFullName = senderName || "User";

  const invoiceTotal = amount || 0;

  useEffect(() => {
  if (!isGiftPayment) return;

  const fetchGiftWithCode = async () => {
    const giftId = recipients[0]?.giftId;
    if (!giftId) {
      console.warn("No giftId found in recipients[0]");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/gift/${giftId}/assign-delivery-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipients[0],
          serviceId: service?._id,
          senderName: buyerFullName,
          message: recipients[0]?.message || "",
        }),
      });

      const data = await res.json();
      console.log("Gift API response:", data);

      if (res.ok && data.code) {
        setGiftCode(data.code);
      } else {
        setGiftCode("Error: no code");
      }
    } catch (err) {
      console.error("Error fetching gift code:", err);
      setGiftCode("Error: request failed");
    }
  };

  fetchGiftWithCode();
}, [isGiftPayment, recipients, service, buyerFullName]);


  const handleWalletPayment = () => alert("Wallet payment coming soon.");
  const handlePaymentRedirect = (method: string) => alert(`${method} payment coming soon.`);

  const paymentMethods = [
    { text: "Telebirr", img: "/telebirr.png", onClick: () => handlePaymentRedirect("Telebirr") },
    { text: "Bank Transfer", img: "/bank.png", onClick: () => handlePaymentRedirect("Bank Transfer") },
    { text: "Card", img: "/card.png", onClick: () => handlePaymentRedirect("Card") },
    { text: "Bank App", img: "/bankapp.png", onClick: () => handlePaymentRedirect("Bank App") },
    { text: "Wallet", img: "/wallet.png", onClick: handleWalletPayment, bg: "bg-[#1c2b21]", hover: "hover:bg-[#162118]", textColor: "text-[#D4AF37]" },
    { text: "Chapa", img: "/chapa.png", onClick: handleWalletPayment, bg: "bg-[#1c2b21]", hover: "hover:bg-[#162118]", textColor: "text-[#D4AF37]" },

  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Invoice / Gift Card Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-52 h-52 bg-gradient-to-br from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-spin-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tr from-[#D4AF37] to-[#1c2b21] rounded-full opacity-20 animate-pulse"></div>

          <h2 className="text-3xl font-bold text-center text-[#1c2b21] mb-6">Payment Summary</h2>

          <DownloadableInvoice
            fullName={buyerFullName}
            total={invoiceTotal}
            giftRecipient={
              isGiftPayment
                ? {
                    name: recipients[0]?.name,
                    message: recipients[0]?.message,
                    itemTitle: service?.title,
                    price: invoiceTotal,
                    type: recipients[0]?.type || "standard",
                    giftCode: giftCode || "Generating...",
                  }
                : undefined
            }
          />

          {isGiftPayment && (
            <div className="mt-6">
              {recipients[0]?.type === "vip" ? (
                <VipGiftCard
                  recipientName={recipients[0]?.name || "Recipient"}
                  code={giftCode || "Generating..."}
                  senderName={buyerFullName}
                  serviceTitle={service?.title || "Unknown Service"}
                  serviceCategory={service?.category || "Unknown Category"}
                  serviceProvider={service?.provider?.name || "Unknown Provider"}
                  serviceLocation={service?.location || "Unknown Location"}
                  message={recipients[0]?.message || "No message"}
                />
              ) : (
                <BasicGiftCard
                  recipientName={recipients[0]?.name || "Recipient"}
                  code={giftCode || "Generating..."}
                  senderName={buyerFullName}
                  serviceTitle={service?.title}
                  serviceCategory={service?.category}
                  serviceProvider={service?.provider?.name || "Not specified"}
                  serviceLocation={service?.location || "Not specified"}
                  message={recipients[0]?.message}
                />
              )}
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1c2b21] mb-4 text-center">Choose Payment Method</h2>
          <p className="text-gray-500 mb-6 text-center">Select a secure method to complete your payment</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {paymentMethods.map((method, i) => (
              <button
                key={i}
                onClick={method.onClick}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-semibold shadow-lg transform transition hover:scale-105 ${method.bg || "bg-gray-100"} ${method.textColor || "text-gray-800"} ${method.hover || "hover:bg-gray-200"}`}
              >
                <img src={method.img} className="h-6 w-auto" />
                {method.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;

