import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type Notification = {
  _id: string;
  message: string;
  createdAt?: string;
  // add other fields if any
};

type NotificationsProps = {
  userId: string;
};

const Notifications = ({ userId }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    axios
      .get<Notification[]>(`${BASE_URL}/notifications/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Notification fetch error:", err));
  }, [userId]);

  return (
    <div className="p-6 bg-white rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((note) => (
          <li key={note._id} className="border-b py-2">
            {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

