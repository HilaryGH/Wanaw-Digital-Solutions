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

interface Provider {
  fullName?: string;
  email?: string;
}

interface GiftWithCode {
  _id: string;
  recipient?: Recipient;
  service?: Service;
  occasion?: string;
  giftCode?: string;
  deliveryStatus?: "pending" | "delivered";
  senderName?: string;
  provider?: Provider;
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
        const res = await axios.get(`${BASE_URL}/services/purchase`);
        const fetchedPurchases = res.data || [];

      const flattenedGifts: GiftWithCode[] = fetchedPurchases.flatMap(
  (purchase: any) =>
    (purchase.gifts || []).map((gift: any) => ({
      _id: gift.giftCode || gift._id,
      service: purchase.service || undefined, // use 'service' from backend
      senderName: purchase.buyerName,
      provider: purchase.provider || undefined,
      occasion: gift.occasion || gift.occasion || "Not specified", // backend field
      giftCode: gift.giftCode,
      deliveryStatus: gift.deliveryStatus,
      recipient: gift.recipient,
    }))
);

    

        setGifts(flattenedGifts);
      } catch (err) {
        console.error("❌ Failed to load gifts:", err);
        setError("Failed to load gifts");
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  const filteredGifts = gifts.filter((gift) => {
    const term = searchTerm.toLowerCase();
    return (
      (gift.service?.title || "").toLowerCase().includes(term) ||
      (gift.service?.category || "").toLowerCase().includes(term) ||
      (gift.recipient?.name || "").toLowerCase().includes(term) ||
      (gift.recipient?.email || "").toLowerCase().includes(term) ||
      (gift.senderName || "").toLowerCase().includes(term) ||
      (gift.provider?.fullName || "").toLowerCase().includes(term) ||
      (gift.provider?.email || "").toLowerCase().includes(term) ||
      (gift.occasion || "").toLowerCase().includes(term) ||
      (gift.giftCode || "").toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-center py-6 text-sm">Loading gifts...</p>;
  if (error) return <p className="text-red-600 text-center text-sm">{error}</p>;

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-700">
        Your Gifts
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by gift, sender, provider, recipient, occasion or code..."
        className="w-full mb-4 sm:mb-6 p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base shadow-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Gifts Table */}
      {filteredGifts.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No matching gifts found.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-purple-200">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-purple-600 text-white text-left uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-2 px-3 sm:px-4 border">Title</th>
                <th className="py-2 px-3 sm:px-4 border">Category</th>
                <th className="py-2 px-3 sm:px-4 border">Occasion</th>
                <th className="py-2 px-3 sm:px-4 border">Sender</th>
                <th className="py-2 px-3 sm:px-4 border">Provider</th>
                <th className="py-2 px-3 sm:px-4 border">Provider Email</th>
                <th className="py-2 px-3 sm:px-4 border">Recipient</th>
                <th className="py-2 px-3 sm:px-4 border">Email</th>
                <th className="py-2 px-3 sm:px-4 border">Phone</th>
                <th className="py-2 px-3 sm:px-4 border">Gift Code</th>
                <th className="py-2 px-3 sm:px-4 border">Status</th>
                <th className="py-2 px-3 sm:px-4 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGifts.map((gift, index) => (
                <tr
                  key={`${gift._id}-${index}`}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-purple-50 transition-colors duration-200`}
                >
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.service?.title || "Untitled"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.service?.category || "Uncategorized"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.occasion}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.senderName || "Unknown"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.provider?.fullName || "N/A"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.provider?.email || "—"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.recipient?.name || "N/A"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.recipient?.email || "—"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">{gift.recipient?.phone || "—"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border font-semibold text-yellow-700">{gift.giftCode || "—"}</td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                        gift.deliveryStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {gift.deliveryStatus || "pending"}
                    </span>
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-3 border text-center">
                    <button
                      onClick={() => setSelectedGiftId(gift._id)}
                      className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-purple-700 transition-colors duration-200 text-xs sm:text-sm"
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Gift Section */}
      {selectedGiftId && (
        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-purple-700">
            Confirm Gift Delivery
          </h2>
          <ConfirmGift giftId={selectedGiftId} />
          <button
            onClick={() => setSelectedGiftId(null)}
            className="mt-3 text-red-600 underline text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default GiftListAndConfirm;







