import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../../api/api";
import DownloadableInvoice from "../Services/DownloadableInvoice";
import BasicGiftCard from "../BasicGiftCard";
import VipGiftCard from "../VipGiftCard";

const PaymentOptions = () => {
  const { state } = useLocation();
  const { service, recipients = [], amount, senderName } = state || {};

  const [recipientsWithCodes, setRecipientsWithCodes] = useState(recipients);
  const [currency, setCurrency] = useState<"ETB" | "USD">("ETB"); // Currency selection
  const [giftCode, setGiftCode] = useState<string | null>(null);

  const isGiftPayment = recipients.length > 0;
  const buyerFullName = senderName || "User";
  const invoiceTotal = amount || 0;
  const exchangeRate = 55; // Example: 1 USD = 55 ETB

  const displayAmount = currency === "ETB" ? invoiceTotal : (invoiceTotal / exchangeRate).toFixed(2);

  // Fetch gift codes for recipients
  useEffect(() => {
    if (!isGiftPayment || !service?._id || !recipients.length) return;

    const fetchGiftCodes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/services/${service._id}/purchase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipients,
            serviceId: service._id,
            senderName: buyerFullName,
          }),
        });

        const data = await res.json();
        console.log("Gift API response:", data);

        if (res.ok && data.codes?.length > 0) {
          const updated = recipients.map((r: any, idx: number) => ({
            ...r,
            giftCode: data.codes[idx] || "No code",
          }));
          setRecipientsWithCodes(updated);
          setGiftCode(updated[0].giftCode);
        } else {
          setGiftCode("Error: no code");
        }
      } catch (err) {
        console.error("Error fetching gift codes:", err);
        setGiftCode("Error: request failed");
      }
    };

    fetchGiftCodes();
  }, [isGiftPayment, recipients, service, buyerFullName]);

  // Payment handlers
  const handleWalletPayment = () => alert(`Wallet payment in ${currency} coming soon.`);
  const handlePaymentRedirect = (method: string) => alert(`${method} payment in ${currency} coming soon.`);

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
          <h2 className="text-3xl font-bold text-center text-[#1c2b21] mb-6">Payment Summary</h2>

          <p className="text-center text-xl font-bold mb-4">Total: {displayAmount} {currency}</p>

          <DownloadableInvoice
            fullName={buyerFullName}
            total={displayAmount}
            giftRecipients={recipientsWithCodes.length > 0 ? recipientsWithCodes.map((r: { name: any; message: any; type: any; giftCode: any; }) => ({
              name: r.name,
              message: r.message,
              itemTitle: service?.title,
              price: displayAmount,
              type: r.type || "standard",
              giftCode: r.giftCode || "Generating...",
            })) : []}
          />

          {isGiftPayment && (
            <div className="mt-6">
              {recipientsWithCodes[0]?.type === "vip" ? (
                <VipGiftCard
                  recipientName={recipientsWithCodes[0]?.name || "Recipient"}
                  code={recipientsWithCodes[0]?.giftCode || "Generating..."}
                  senderName={buyerFullName}
                  serviceTitle={service?.title || "Service"}
                  serviceCategory={service?.category || "Category"}
                  serviceProvider={service?.provider?.name || "Not specified"}
                  serviceLocation={service?.location || "Not specified"}
                  message={recipientsWithCodes[0]?.message || ""}
                  recipientEmail={recipientsWithCodes[0]?.email}
                  photo={recipientsWithCodes[0]?.photo ? `${BASE_URL}/uploads/${recipientsWithCodes[0].photo}` : undefined}
                />
              ) : (
                <BasicGiftCard
                  recipientName={recipientsWithCodes[0]?.name || "Recipient"}
                  code={giftCode || "Generating..."}
                  senderName={buyerFullName}
                  serviceTitle={service?.title}
                  serviceCategory={service?.category}
                  serviceProvider={service?.provider?.name || "Not specified"}
                  serviceLocation={service?.location || "Not specified"}
                  message={recipientsWithCodes[0]?.message}
                />
              )}
            </div>
          )}
        </div>


        {/* Currency Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setCurrency("ETB")}
            className={`px-4 py-2 rounded-lg font-semibold ${currency === "ETB" ? "bg-[#D4AF37] text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Birr
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-lg font-semibold ${currency === "USD" ? "bg-[#D4AF37] text-white" : "bg-gray-200 text-gray-800"}`}
          >
            USD
          </button>
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

