import { useEffect, useState } from "react";
import BASE_URL from "../../../api/api";

const ManageServices = () => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    const res = await fetch(`${BASE_URL}/services`);
    const data = await res.json();
    setServices(data);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this service?");
    if (!confirm) return;

    await fetch(`${BASE_URL}/services/${id}`, {
      method: "DELETE",
    });
    fetchServices(); // Refresh
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const confirm = window.confirm(`Set status to '${status}'?`);
    if (!confirm) return;

    await fetch(`${BASE_URL}/services/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchServices(); // Refresh
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Provider</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s: any) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.title}</td>
              <td className="p-2">{s.category}</td>
              <td className="p-2">{s.providerId?.fullName || "N/A"}</td>
              <td className="p-2 capitalize">{s.status || "pending"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleStatusUpdate(s._id, "approved")}
                  className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(s._id, "denied")}
                  className="bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                >
                  Deny
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageServices;

