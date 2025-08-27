import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type Recipient = { name?: string; email?: string; phone?: string };
type Gift = { giftCode: string; recipient: Recipient; deliveryStatus?: string; occasion?: string };

type Purchase = {
  id: string;
  itemType: "Service" | "gift";
  item?: { id: string; title?: string; category?: string; location?: string; price?: number };
  provider?: { id: string; fullName?: string; email?: string; phone?: string };
  buyerName: string;
  buyerEmail: string;
  amount: number;
  purchaseDate: string;
  deliveryDate?: string;
  gifts: Gift[];
};

const GiftListForProvider = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [giftCodes, setGiftCodes] = useState<{ [key: string]: string }>({});
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
        const res = await axios.get(`${BASE_URL}/purchase/provider/${providerId}/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || [];
        console.log("Fetched purchases:", data);

        const normalized: Purchase[] = data.map((p: any) => ({
          ...p,
          gifts: p.gifts ?? [],
        }));

        const initialGiftCodes: { [key: string]: string } = {};
        normalized.forEach((p) =>
          p.gifts.forEach((g, idx) => (initialGiftCodes[`${p.id}-${idx}`] = g.giftCode))
        );

        setPurchases(normalized);
        setGiftCodes(initialGiftCodes);
      } catch (err: any) {
        console.error("Failed to fetch purchases:", err.response?.data || err.message);
        setError("Failed to fetch purchases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [providerId, token]);

  const filteredPurchases = purchases.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.item?.title?.toLowerCase().includes(term) ?? false) ||
      p.buyerName.toLowerCase().includes(term) ||
      p.buyerEmail.toLowerCase().includes(term) ||
      p.gifts.some((g) => g.recipient?.name?.toLowerCase().includes(term) ?? false) ||
      p.gifts.some((g) => g.giftCode?.toLowerCase().includes(term) ?? false)
    );
  });

  const handleStatusChange = async (giftCode: string, newStatus: string) => {
    const statusLower = newStatus.toLowerCase();
    try {
      await axios.post(
        `${BASE_URL}/purchase/gift/update-status`,
        { giftCode, newStatus: statusLower },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPurchases((prev) =>
        prev.map((p) => ({
          ...p,
          gifts: p.gifts.map((g) =>
            g.giftCode === giftCode ? { ...g, deliveryStatus: statusLower } : g
          ),
        }))
      );
      setMessages((prev) => ({ ...prev, [giftCode]: `✅ Status updated to ${statusLower}` }));
    } catch (err: any) {
      setMessages((prev) => ({ ...prev, [giftCode]: err.response?.data?.msg || "❌ Update failed" }));
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Purchased Services & Gifts</h1>

      <input
        type="text"
        placeholder="Search purchases, gifts or recipients..."
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
              <th className="px-4 py-2 text-left">Recipient</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Gift Code</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No purchased services found.
                </td>
              </tr>
            ) : (
              filteredPurchases.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{p.item?.title || "Untitled"}</td>
                  <td className="px-4 py-2">{p.buyerName}</td>
                  <td className="px-4 py-2">{p.buyerEmail}</td>
                  <td className="px-4 py-2">
                    {(p.gifts ?? []).map((g, idx) => (
                      <p key={idx} className="text-sm mb-1">{g.recipient.name || "N/A"}</p>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {(p.gifts ?? []).map((g, idx) => (
                      <p key={idx} className="text-sm mb-1">{g.recipient.phone || "N/A"}</p>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {(p.gifts ?? []).map((g, idx) => {
                      const key = `${p.id}-${idx}`;
                      return (
                        <input
                          key={key}
                          type="text"
                          value={giftCodes[key] ?? g.giftCode}
                          onChange={(e) =>
                            setGiftCodes((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="px-2 py-1 border rounded text-sm w-28 mb-1"
                          placeholder={g.recipient.name || "Recipient"}
                        />
                      );
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {(p.gifts ?? []).map((g, idx) => (
                      <div key={idx} className="mb-1">
                        <select
                          value={(g.deliveryStatus || "pending").toLowerCase()}
                          onChange={(e) => handleStatusChange(g.giftCode, e.target.value)}
                          className="border rounded px-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                        {messages[g.giftCode] && (
                          <p className="text-xs text-gray-600 mt-1">{messages[g.giftCode]}</p>
                        )}
                      </div>
                    ))}
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















