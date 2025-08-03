import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type Gift = {
  _id: string;            // matches the key you used for map key
  title?: string;
  sender?: string;
  recipient?: string;
  amount?: number;
  createdAt: string;
};

type GiftActivityProps = {
  userId: string;
};

const GiftActivity = ({ userId }: GiftActivityProps) => {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    axios
      .get<Gift[]>(`${BASE_URL}/gift/provider/${userId}`)
      .then((res) => setGifts(res.data))
      .catch((err) => console.error("Gift fetch error:", err));
  }, [userId]);

  return (
    <div className="p-6 bg-white rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Gift Activities</h2>
      <ul className="space-y-2">
        {gifts.map((gift) => (
          <li key={gift._id} className="border-b py-2">
            {gift.title || "Gift sent"} – {new Date(gift.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GiftActivity;


