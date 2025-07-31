import { useLocation } from "react-router-dom";
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
    total,
    email,
    fullName,
    phone,
    buyerId,
    senderName,   // from gift form
    senderEmail,  // from gift form
  } = state || {};

  const isCartPayment = Array.isArray(cart) && cart.length > 0;
  const isGiftPayment = recipients.length > 0 && !isCartPayment;

  // Prepare giftRecipients array if it's a gift payment


  // Use buyer info: for gift use senderName/email, else from props
  const buyerFullName = senderName || fullName || "User";
  const buyerEmail = senderEmail || email || "";

  const handleChapaPayment = async () => {
    const token = localStorage.getItem("token");

    const payload = isCartPayment
      ? {
          amount: total || 0,
          email: buyerEmail,
          first_name: buyerFullName?.split(" ")[0] || "User",
          last_name: buyerFullName?.split(" ")[1] || "Wanaw",
          phone_number: phone || "0910000000",
          cart,
          buyerId,
        }
      : {
          amount: amount || 0,
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
    <>
      <div className="max-w-xl mx-auto p-6">
        <DownloadableInvoice
          fullName={buyerFullName}
          email={buyerEmail}
          cart={isCartPayment ? cart : undefined}
          total={isCartPayment ? total : amount}
        // pass first gift recipient for invoice
        />

        <h2 className="text-2xl font-bold mb-4">Choose Payment Method</h2>

        {isCartPayment ? (
          <>
            <p className="mb-2">
              Items in Cart: <strong>{cart.length}</strong>
            </p>
            <p className="mb-4">
              Total Amount: <strong>{total} ETB</strong>
            </p>
          </>
        ) : isGiftPayment ? (
          <>
            <p className="mb-2">
              Gift Item: <strong>{service?.title}</strong>
            </p>
            {/* Recipient info removed here */}
            <p className="mb-4">
              Total Amount: <strong>{amount} ETB</strong>
            </p>
          </>
        ) : (
          <p>No payment data available.</p>
        )}

        <div className="grid gap-4">
          <button className="p-3 bg-green text-gold rounded"><img src="/EthioTel.png" alt="Telebirr" className="h-6 w-auto" />Pay with Telebirr</button>
          <button className="p-3 bg-green text-gold rounded"><img src="/assets/telebirr.png" alt="Telebirr" className="h-6 w-auto" />Pay with Bank Transfer</button>
          <button className="p-3 bg-green text-gold rounded"><img src="/assets/telebirr.png" alt="Telebirr" className="h-6 w-auto" />Pay with Card</button>
          <button className="p-3 bg-green text-gold rounded"><img src="/assets/telebirr.png" alt="Telebirr" className="h-6 w-auto" />Pay with Bank App</button>
          <button
            onClick={handleWalletPayment}
            className="p-3 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
          > <img src="/assets/telebirr.png" alt="Telebirr" className="h-6 w-auto" />
            Pay with Wallet
          </button>
          <button
            onClick={handleChapaPayment}
            className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
             <img src="/chapa.png" alt="Telebirr" className="h-6 w-auto" />
            Pay with Chapa
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentOptions;








