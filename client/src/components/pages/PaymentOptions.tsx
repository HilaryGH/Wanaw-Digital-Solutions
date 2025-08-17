import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../../api/api";
import DownloadableInvoice from "../Services/DownloadableInvoice";

const PaymentOptions = () => {
  const { state } = useLocation();

  const {
    service,
    recipients = [],
    amount,
    occasion,
    notifyProvider = false,
    providerMessage = "",
    cart,
    email,
    fullName,
    phone,
    buyerId,
    senderName,
    senderEmail,
  } = state || {};

  const [giftCode, setGiftCode] = useState<string | null>(null);

  const isCartPayment = Array.isArray(cart) && cart.length > 0;
  const isGiftPayment = recipients.length > 0 && !isCartPayment;

  const buyerFullName = senderName || fullName || "User";
  const buyerEmail = senderEmail || email || "";

  // ✅ Compute invoice total (matches DownloadableInvoice)
  const invoiceTotal = isCartPayment
    ? cart.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0)
    : amount || 0;

  // ✅ Assign gift code from backend
  useEffect(() => {
    if (!isGiftPayment) return;

    const assignGiftCode = async () => {
      const token = localStorage.getItem("token");
      const giftId = recipients[0]?._id;
      if (!giftId) return;

      try {
        const res = await fetch(`${BASE_URL}/gift/${giftId}/assign-delivery-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            recipient: recipients[0],
            service,
            senderName: buyerFullName,
            message: providerMessage,
          }),
        });

        const data = await res.json();
        if (res.ok && data.code) {
          setGiftCode(data.code); // 🎁 Set the actual gift code
        } else {
          console.error("Failed to assign gift code:", data);
        }
      } catch (err) {
        console.error("Error assigning gift code:", err);
      }
    };

    assignGiftCode();
  }, [isGiftPayment, recipients, service, buyerFullName, providerMessage]);

  const handleChapaPayment = async () => {
    const token = localStorage.getItem("token");

    const payload = isCartPayment
      ? {
          amount: invoiceTotal, // ✅ use computed total
          email: buyerEmail,
          first_name: buyerFullName?.split(" ")[0] || "User",
          last_name: buyerFullName?.split(" ")[1] || "Wanaw",
          phone_number: phone || "0910000000",
          cart,
          buyerId,
        }
      : {
          amount: invoiceTotal, // ✅ use computed total
          quantity: recipients.length,
          email: recipients[0]?.email || "",
          phone_number: recipients[0]?.phone || "",
          whatsapp_number: recipients[0]?.whatsapp || "",
          first_name: buyerFullName?.split(" ")[0] || "User",
          last_name: buyerFullName?.split(" ")[1] || "Wanaw",
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
          ...(token && { Authorization: `Bearer ${token}` }),
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
    alert("Wallet payment coming soon.");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Invoice */}
      <DownloadableInvoice
        fullName={buyerFullName}
        cart={isCartPayment ? cart : undefined}
        total={invoiceTotal} // ✅ consistent total
        giftRecipient={
          isGiftPayment
            ? {
                name: recipients[0]?.name,
                email: recipients[0]?.email,
                phone: recipients[0]?.phone,
                message: recipients[0]?.message,
                itemTitle: service?.title,
                price: invoiceTotal, // ✅ consistent total
                type: recipients[0]?.type || "standard",
                giftCode: giftCode || "Generating...",
              }
            : undefined
        }
      />

      {/* Payment summary */}
      <h2 className="text-2xl font-bold mb-4">Choose Payment Method</h2>

      {isCartPayment ? (
        <>
          <p className="mb-2">
            Items in Cart: <strong>{cart.length}</strong>
          </p>
          <p className="mb-4">
            Total Amount: <strong>{invoiceTotal} ETB</strong> {/* ✅ consistent total */}
          </p>
        </>
      ) : isGiftPayment ? (
        <>
          <p className="mb-2">
            Gift Item: <strong>{service?.title}</strong>
          </p>
          <p className="mb-4">
            Total Amount: <strong>{invoiceTotal} ETB</strong> {/* ✅ consistent total */}
          </p>
        </>
      ) : (
        <p>No payment data available.</p>
      )}

      {/* Payment buttons */}
      <div className="grid gap-4 grid-cols-1">
        {[
          { text: "Pay with Telebirr", img: "/telebirr.png", onClick: null },
          { text: "Pay with Bank Transfer", img: "/assets/telebirr.png", onClick: null },
          { text: "Pay with Card", img: "/assets/telebirr.png", onClick: null },
          { text: "Pay with Bank App", img: "/assets/telebirr.png", onClick: null },
          { text: "Pay with Wallet", img: "/assets/telebirr.png", onClick: handleWalletPayment, bg: "bg-purple-700", hover: "hover:bg-purple-800", textColor: "text-white" },
          { text: "Pay with Chapa", img: "/chapa.png", onClick: handleChapaPayment, bg: "bg-green-600", hover: "hover:bg-green-700", textColor: "text-white" },
        ].map(({ text, img, onClick, bg = "bg-green", hover = "", textColor = "text-gold" }, i) => (
          <button
            key={i}
            onClick={onClick || undefined}
            className={`payment-button ${bg} ${textColor} ${hover}`}
          >
            <img src={img} className="h-6 w-auto mr-2" />
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;












