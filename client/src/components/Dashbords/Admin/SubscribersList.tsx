import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api"; // adjust as needed

interface Subscriber {
  _id: string;
  email: string;
  createdAt?: string;
}

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/subscribe`)
      .then((res) => setSubscribers(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Subscribers</h2>
      <ul className="space-y-2">
        {subscribers.map((sub) => (
          <li key={sub._id} className="text-sm text-gray-700">
            📧 {sub.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscribersList;

