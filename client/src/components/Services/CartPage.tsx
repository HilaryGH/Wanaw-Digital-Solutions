import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FiShoppingCart } from "react-icons/fi"; // 🛒 icon

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const isLoggedIn = !!localStorage.getItem("user");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

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

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleConfirmPayment = () => {
    const email = isLoggedIn ? user.email : guestEmail;
    const fullName = isLoggedIn ? user.fullName : guestName;
    const firstName = fullName?.split(" ")[0] || "Gift";
    const lastName = fullName?.split(" ")[1] || "Receiver";
    const phone = user.phone || "0910000000";
    const buyerId = isLoggedIn ? user._id : null;

    if (!email || !firstName) {
      alert("Please enter your name and email to proceed.");
      return;
    }

    navigate("/payment-options", {
      state: {
        cart,
        total,
        email,
        fullName,
        firstName,
        lastName,
        phone,
        buyerId,
      },
    });
  };

  const goToServices = () => navigate("/services");

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <FiShoppingCart className="mx-auto text-4xl text-gray-400 mb-2" />
        <p>Your cart is empty.</p>
        <button
          onClick={goToServices}
          className="mt-4 px-5 py-2 bg-[#1c2b21] text-white rounded hover:bg-[#162219]"
        >
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      {/* 🛒 Cart Header */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <FiShoppingCart className="text-2xl text-[#1c2b21]" />
        <h1 className="text-2xl font-bold text-center text-[#1c2b21]">Your Cart</h1>
      </div>

      {/* 🛍️ Cart Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            <h2 className="text-lg font-semibold mb-2 text-[#1c2b21]">{item.title}</h2>
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

      {/* 👤 Guest Info */}
      {!isLoggedIn && (
        <div className="max-w-md mx-auto mt-10 space-y-4">
          <input
            type="text"
            placeholder="Your Full Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      )}

      {/* 💳 Total and Action Buttons */}
      <div className="max-w-md mx-auto mt-8 flex flex-col items-center space-y-4">
        <p className="text-xl font-semibold text-[#1c2b21]">
          Total: ${total.toFixed(2)}
        </p>

        <button
          onClick={handleConfirmPayment}
          className="w-full rounded-lg bg-[#1c2b21] py-3 text-white font-semibold hover:rounded-full transition"
        >
          Confirm & Choose Payment
        </button>

        <button
          onClick={goToServices}
          className="w-full mt-2 rounded-lg bg-[#D4AF37] text-[#1c2b21] py-3  font-semibold hover:rounded-full transition"
        >
          Add More Services
        </button>
      </div>
    </div>
  );
};

export default CartPage;





