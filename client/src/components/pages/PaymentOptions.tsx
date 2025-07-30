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
  } = state || {};

  const isCartPayment = Array.isArray(cart) && cart.length > 0;

  const handleChapaPayment = async () => {
    const token = localStorage.getItem("token");

    const payload = isCartPayment
      ? {
          amount: total || 0,
          email,
          first_name: fullName?.split(" ")[0] || "User",
          last_name: fullName?.split(" ")[1] || "Wanaw",
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
          first_name: fullName?.split(" ")[0] || "User",
          last_name: fullName?.split(" ")[1] || "Wanaw",
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
  fullName={state.fullName}
  email={state.email}
  cart={state.cart}
  total={state.total}
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
      ) : (
        <>
          <p className="mb-2">
            For: <strong>{service?.title}</strong>
          </p>
          <p className="mb-2">
            Recipients: <strong>{recipients.length}</strong>
          </p>
          <p className="mb-4">
            Total Amount: <strong>{amount} ETB</strong>
          </p>
        </>
      )}

      <div className="grid gap-4">
        <button className="p-3 bg-green text-gold rounded">Pay with Telebirr</button>
        <button className="p-3 bg-green text-gold rounded">Pay with Bank Transfer</button>
        <button className="p-3 bg-green text-gold rounded">Pay with Card</button>
        <button className="p-3 bg-green text-gold rounded">Pay with Bank App</button>
        <button
          onClick={handleWalletPayment}
          className="p-3 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
        >
          Pay with Wallet
        </button>
        <button
          onClick={handleChapaPayment}
          className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Pay with Chapa
        </button>
      </div>
    </div>

</>
  );
};

export default PaymentOptions;




