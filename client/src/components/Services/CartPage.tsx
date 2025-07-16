import { useState, useEffect } from "react";

import BASE_URL from "../../api/api";

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [isPaying, setIsPaying] = useState(false);
  

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /** Total for display & payment amount */
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  /** Start payment then redirect */
  const handleConfirmPayment = async () => {
    // 👉 Replace this with the real recipient email (e.g. from auth or a form)
    const recipientEmail = "hilarygebremedhn28@gmail.com";

    try {
      setIsPaying(true);

      const res = await fetch(`${BASE_URL}/payment/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          email: recipientEmail,
          first_name: "Gift",
          last_name: "Receiver",
          phone_number: "0910000000",
          cart,
        }),
      });

      const data = await res.json();

      if (data.checkout_url) {
        // Redirect to your provider’s checkout page
        window.location.href = data.checkout_url;
      } else {
        alert("Payment initiation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error");
    } finally {
      setIsPaying(false);
    }
  };

  if (cart.length === 0) {
    return <p className="text-center mt-10">Your cart is empty.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <h1 className="text-2xl font-bold text-center mb-8 text-[#1c2b21]">
        Your Cart
      </h1>

      {/* 🛍️ Cart items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cart.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
           {item.imageUrl && (
  <img
    src={item.imageUrl}
    alt={item.title}
    className="w-full h-48 object-cover mb-3 rounded-md"
  />
)}

            <h2 className="text-lg font-semibold mb-2 text-[#1c2b21]">
              {item.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{item.category}</p>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <p className="font-semibold text-[#D4AF37] mb-2">${item.price}</p>
            <button
              onClick={() => removeFromCart(index)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* 💳 Total and Confirm button */}
      <div className="max-w-md mx-auto mt-10 flex flex-col items-center space-y-4">
        <p className="text-xl font-semibold text-[#1c2b21]">
          Total: ${total.toFixed(2)}
        </p>

        <button
          onClick={handleConfirmPayment}
          disabled={isPaying}
          className="w-full rounded-lg bg-[#1c2b21] py-3 text-white
                     font-semibold hover:bg-[#162219] transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPaying ? "Processing…" : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;


