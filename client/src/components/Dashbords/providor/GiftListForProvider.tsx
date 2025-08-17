import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmGift from "../../ConfirmGift";
import BASE_URL from "../../../api/api";

type Gift = {
  _id: string;
  title: string;
  recipient?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  senderName?: string;
  providerId?: string;
  price?: number;
};

type Service = {
  _id: string;
  title: string;
  price?: number;
};

type Purchase = {
  _id: string;
  itemType: "gift" | "service";
  itemId: Gift | Service;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  purchaseDate: string;
  deliveryDate?: string;
  extraInfo?: any;
};

const GiftListForProvider = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const providerId = localStorage.getItem("providerId");
  const token = localStorage.getItem("token");

  // 1️⃣ Fetch provider services
  useEffect(() => {
    const fetchProviderServices = async () => {
      if (!providerId || !token) {
        setError("Provider not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/services/provider/${providerId}/services`, {
  headers: { Authorization: `Bearer ${token}` },
});


        setServices(res.data);
        if (res.data.length > 0) setServiceId(res.data[0]._id);
      } catch (err: any) {
        console.error("❌ Failed to fetch services:", err.response?.data || err.message);
        setError("Failed to fetch services.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderServices();
  }, [providerId, token]);

  // 2️⃣ Fetch gifts for selected service
  useEffect(() => {
    if (!serviceId) return;

    const fetchGifts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gift/service/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const giftsData: Gift[] = Array.isArray(res.data) ? res.data : res.data.gifts || [];
        setGifts(giftsData);
      } catch (err: any) {
        console.error("❌ Fetch gifts error:", err.response?.data || err.message);
        setError("Failed to load gifts.");
      }
    };

    fetchGifts();
  }, [serviceId, token]);

  // 3️⃣ Fetch all purchases for provider
  useEffect(() => {
    if (!providerId || !token) return;

    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/purchase/provider/${providerId}/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPurchases(res.data);
      } catch (err: any) {
        console.error("❌ Failed to fetch purchases:", err.response?.data || err.message);
      }
    };

    fetchPurchases();
  }, [providerId, token]);

  const filteredGifts = gifts.filter(
    (gift) =>
      (gift.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      gift.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gift.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Gifts & Purchases</h1>

      {/* Service Selector */}
      {services.length > 1 && (
        <select
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={serviceId || ""}
          onChange={(e) => setServiceId(e.target.value)}
        >
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title}
            </option>
          ))}
        </select>
      )}

      {/* Gift Search */}
      <input
        type="text"
        placeholder="Search gifts..."
        className="w-full mb-6 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Gifts */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mb-6">
        {filteredGifts.length === 0 ? (
          <p className="text-center col-span-full">No gifts found for this service.</p>
        ) : (
          filteredGifts.map((gift) => (
            <div key={gift._id} className="bg-white shadow-lg rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-blue-800">{gift.title}</h3>
              <p className="text-sm text-gray-600 mt-1">🎁 Sender: {gift.senderName || "Unknown"}</p>
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

      {/* Purchases */}
      <h2 className="text-xl font-semibold mb-2">All Purchases</h2>
      {purchases.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Item</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Buyer</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Purchase Date</th>
                <th className="py-2 px-4 border">Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id} className="text-center border-b">
                  <td className="py-2 px-4">{p.itemId.title}</td>
                  <td className="py-2 px-4">{p.itemType}</td>
                  <td className="py-2 px-4">{p.buyerName}</td>
                  <td className="py-2 px-4">{p.buyerEmail}</td>
                  <td className="py-2 px-4">{p.amount}</td>
                  <td className="py-2 px-4">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default GiftListForProvider;
