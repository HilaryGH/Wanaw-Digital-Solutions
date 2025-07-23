import { useState } from "react";
import axios from "axios";

const ConfirmDelivery = ({ providerId }: { providerId: string }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/confirm-delivery", {
        code,
        providerId,
      });

      setMessage(response.data.msg);
    } catch (err: any) {
      setMessage(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Confirm Delivery</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 4-digit code"
        maxLength={4}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Confirming..." : "Confirm Delivery"}
      </button>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default ConfirmDelivery;
