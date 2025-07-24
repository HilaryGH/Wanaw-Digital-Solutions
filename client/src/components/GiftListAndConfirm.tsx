import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmGift from "./ConfirmGift"; // adjust path as needed
import BASE_URL from "../api/api";

type Gift = {
  _id: string;
  title: string;
  // add other gift fields if needed
};

const GiftListAndConfirm = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gift`);
        setGifts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load gifts");
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  if (loading) return <p>Loading gifts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Gifts</h1>

      <ul className="mb-6">
        {gifts.length === 0 && <li>No gifts available.</li>}
        {gifts.map((gift) => (
          <li key={gift._id} className="mb-2 flex justify-between items-center">
            <span>{gift.title}</span>
            <button
              onClick={() => setSelectedGiftId(gift._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Confirm Delivery
            </button>
          </li>
        ))}
      </ul>

      {selectedGiftId && (
        <>
          <h2 className="text-xl font-semibold mb-2">Confirm Gift Delivery</h2>
          <ConfirmGift giftId={selectedGiftId} />
          <button
            onClick={() => setSelectedGiftId(null)}
            className="mt-4 text-red-600 underline"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default GiftListAndConfirm;

