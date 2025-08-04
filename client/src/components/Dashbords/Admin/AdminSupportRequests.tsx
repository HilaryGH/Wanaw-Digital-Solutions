import { useEffect, useState } from "react";
import BASE_URL from "../../../api/api";

type SupportRequest = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

const AdminSupportRequests = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/support`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching support requests", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl bg-green mx-auto">
      <h1 className="text-2xl text-gold font-bold mb-6 text-center">Support Requests</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center">No support requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{requests.map((req) => (
  <div
    key={req._id}
    className="border rounded-md shadow-md p-4 bg-white flex flex-col"
  >
    <p>
      <strong>Name:</strong> {req.name}
    </p>
    <p>
      <strong>Email:</strong>{" "}
      <a
        href={`mailto:${req.email}`}
        className="text-gold hover:underline"
      >
        {req.email}
      </a>
    </p>
    <p>
      <strong>Subject:</strong> {req.subject}
    </p>
    <p className="flex-grow">
      <strong>Message:</strong> {req.message}
    </p>
    <p className="text-sm text-gray-500 mt-4">
      Submitted: {new Date(req.createdAt).toLocaleString()}
    </p>
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default AdminSupportRequests;
