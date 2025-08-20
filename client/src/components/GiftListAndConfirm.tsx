import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmGift from "./ConfirmGift";
import BASE_URL from "../api/api";

interface Recipient {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
}

interface Service {
  title?: string;
  category?: string;
}

interface GiftWithCode {
  _id: string;
  senderName?: string;
  recipient?: Recipient;
  service?: Service;
  occasion?: string;
  giftCode?: string;
  deliveryStatus?: "pending" | "delivered";
  providerName?: string;
}

const GiftListAndConfirm: React.FC = () => {
  const [gifts, setGifts] = useState<GiftWithCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await axios.get<GiftWithCode[]>(`${BASE_URL}/gift/with-codes`);
        setGifts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load gifts");
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  const filteredGifts = gifts.filter((gift) =>
    (gift.service?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gift.recipient?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gift.senderName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gift.occasion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gift.giftCode || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center py-6">Loading gifts...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Gifts</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by gift, sender, recipient, occasion or code..."
        className="w-full mb-6 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      {filteredGifts.length === 0 ? (
        <p>No matching gifts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Occasion</th>
                <th className="py-2 px-4 border">Sender</th>
                <th className="py-2 px-4 border">Recipient</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Gift Code</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGifts.map((gift, index) => (
                <tr
                  key={gift._id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 border">{gift.service?.title || "Untitled"}</td>
                  <td className="py-2 px-4 border">{gift.service?.category || "Uncategorized"}</td>
                  <td className="py-2 px-4 border">{gift.occasion || "Not specified"}</td>
                  <td className="py-2 px-4 border">{gift.senderName || "Unknown"}</td>
                  <td className="py-2 px-4 border">{gift.recipient?.name || "N/A"}</td>
                  <td className="py-2 px-4 border">{gift.recipient?.email || "—"}</td>
                  <td className="py-2 px-4 border">{gift.recipient?.phone || "—"}</td>
                  <td className="py-2 px-4 border">{gift.giftCode || "—"}</td>
                  <td className="py-2 px-4 border">{gift.deliveryStatus || "pending"}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => setSelectedGiftId(gift._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Confirm Delivery
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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






