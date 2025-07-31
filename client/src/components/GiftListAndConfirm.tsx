import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmGift from "./ConfirmGift";
import BASE_URL from "../api/api";

type Gift = {
  _id: string;
  title?: string;
  service?: {
    title?: string;
    category?: string;
  };
  recipient?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  senderName?: string;
  occasion?: string;
};

const GiftListAndConfirm = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gift`);
        const processedGifts = res.data.map((gift: Gift) => ({
          _id: gift._id,
          senderName: gift.senderName || "Unknown",
          recipient: gift.recipient || {
            name: "N/A",
            email: "N/A",
            phone: "N/A",
          },
          occasion: gift.occasion || "Not specified",
          service: {
            title: gift.service?.title || "Untitled",
            category: gift.service?.category || "Uncategorized",
          },
        }));
        setGifts(processedGifts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load gifts");
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  const filteredGifts = gifts.filter((gift) =>
    (gift.service?.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    gift.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gift.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gift.occasion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center py-6">Loading gifts...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Gifts</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by gift, sender, recipient or occasion..."
        className="w-full mb-6 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Gift List */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {filteredGifts.length === 0 ? (
          <p>No matching gifts found.</p>
        ) : (
          filteredGifts.map((gift) => (
            <div
              key={gift._id}
              className="bg-white shadow-lg rounded-lg p-4 border"
            >
              <h3 className="text-lg font-semibold text-blue-800">
  {gift.service?.title || "Untitled"}
</h3>
              <p className="text-sm text-gray-600 mt-1">
                🎁 Occasion: {gift.occasion}
              </p>
             <p className="text-sm text-gray-600">🏷️ Category: {gift.service?.category || "Uncategorized"}</p>

              <p className="text-sm text-gray-600">
                👤 Sender: {gift.senderName}
              </p>
              <p className="text-sm text-gray-600">👤 Recipient: {gift.recipient?.name || "N/A"}</p>
<p className="text-sm text-gray-600">📧 Email: {gift.recipient?.email || "N/A"}</p>
<p className="text-sm text-gray-600">📞 Phone: {gift.recipient?.phone || "N/A"}</p>

              <button
                onClick={() => setSelectedGiftId(gift._id)}
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Confirm Delivery
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirm Section */}
      {selectedGiftId && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Confirm Gift Delivery</h2>
          <ConfirmGift giftId={selectedGiftId} />
          <button
            onClick={() => setSelectedGiftId(null)}
            className="mt-4 text-red-600 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default GiftListAndConfirm;



