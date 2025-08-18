import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type PurchasedItem = {
  _id: string;
  title: string;
  price?: number;
};

type Purchase = {
  _id: string;
  itemType: "gift" | "service";
  itemId: PurchasedItem;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  purchaseDate: string;
  deliveryDate?: string;
  extraInfo?: any;
};

const GiftListForProvider = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [giftCodes, setGiftCodes] = useState<{
    [key: string]: { _id: string; giftCode: string };
  }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const providerId = localStorage.getItem("providerId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!providerId || !token) {
        setError("Provider not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${BASE_URL}/purchase/provider/${providerId}/purchases`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const servicePurchases = res.data.filter(
          (p: Purchase) => p.itemType === "service"
        );

        // Initialize giftCodes state
        const initialGiftCodes: typeof giftCodes = {};
        servicePurchases.forEach((p: Purchase) => {
          initialGiftCodes[p._id] = {
            _id: p.extraInfo?.giftId || "",        // Gift ID from backend
            giftCode: p.extraInfo?.giftCode || "", // Pre-existing gift code if any
          };
        });

        setPurchases(servicePurchases);
        setGiftCodes(initialGiftCodes);
      } catch (err: any) {
        console.error(
          "❌ Failed to fetch purchases:",
          err.response?.data || err.message
        );
        setError("Failed to fetch purchases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [providerId, token]);

  const filteredPurchases = purchases.filter(
    (p) =>
      p.itemId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = async (purchaseId: string) => {
    const giftCodeObj = giftCodes[purchaseId];
    if (!giftCodeObj?._id || !giftCodeObj?.giftCode) {
      setMessages((prev) => ({
        ...prev,
        [purchaseId]: "❌ Gift ID and code are required",
      }));
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/gift/confirm-gift`,
        {
          giftId: giftCodeObj._id,
          giftCode: giftCodeObj.giftCode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => ({
        ...prev,
        [purchaseId]: `✅ ${response.data.msg || "Confirmed successfully"}`,
      }));
    } catch (error: any) {
      setMessages((prev) => ({
        ...prev,
        [purchaseId]:
          error.response?.data?.msg ||
          "❌ An error occurred during confirmation",
      }));
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Purchased Services
      </h1>

      <input
        type="text"
        placeholder="Search purchases..."
        className="w-full mb-6 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-sm rounded-lg bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Buyer</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Gift Code</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Purchase Date</th>
              <th className="px-4 py-2 text-left">Delivery Date</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No purchased services found.
                </td>
              </tr>
            ) : (
              filteredPurchases.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{p.itemId.title}</td>
                  <td className="px-4 py-2">{p.buyerName}</td>
                  <td className="px-4 py-2">{p.buyerEmail}</td>
                  <td className="px-4 py-2 font-mono text-purple-600">
                    {giftCodes[p._id]?.giftCode || "-"}
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    ${p.amount}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(p.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {p.deliveryDate
                      ? new Date(p.deliveryDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <input
                        type="text"
                        placeholder="Enter gift code"
                        value={giftCodes[p._id]?.giftCode || ""}
                        onChange={(e) =>
                          setGiftCodes((prev) => ({
                            ...prev,
                            [p._id]: {
                              _id: prev[p._id]?._id || "",
                              giftCode: e.target.value,
                            },
                          }))
                        }
                        className="px-2 py-1 border rounded text-sm w-32"
                      />
                      <button
                        onClick={() => handleConfirm(p._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Confirm
                      </button>
                      {messages[p._id] && (
                        <p className="text-xs text-gray-600">{messages[p._id]}</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GiftListForProvider;



