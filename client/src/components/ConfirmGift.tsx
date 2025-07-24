import { useState } from "react";
import axios from "axios";
import BASE_URL from "../api/api";

type ConfirmGiftProps = {
  giftId: string;      // <-- add giftId here
  providerId?: string; // optional, if needed later
};

const ConfirmGift = ({ giftId, }: ConfirmGiftProps) => {
  const [giftCode, setGiftCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}gift/${giftId}/confirm-gift`, {
        code: giftCode,
      });

      setMessage(response.data.msg);
      setIsSuccess(true);
    } catch (err: any) {
      setMessage(err.response?.data?.msg || "Something went wrong.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Gift Delivery</h2>
      <input
        type="text"
        value={giftCode}
        onChange={(e) => setGiftCode(e.target.value)}
        placeholder="Enter 4-digit gift code"
        maxLength={4}
        className="border p-2 w-full mb-4 rounded outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition duration-200"
        disabled={loading || giftCode.length !== 4}
      >
        {loading ? "Confirming..." : "Confirm Gift"}
      </button>
      {message && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ConfirmGift;

