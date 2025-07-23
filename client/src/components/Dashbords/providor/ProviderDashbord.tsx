import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  const checkUser = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "provider") return navigate("/login");

    setUser(parsedUser);
  };

  checkUser();
}, [navigate]);

  if (!user) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.fullName}</h1>
      <p className="text-gray-600 mb-6">
        You are logged in as a <strong>Service Provider</strong>. Here you can manage your services and bookings.
      </p>

      {/* Example Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Add New Service</h2>
          <p className="text-gray-600 mb-4">
            Create a new service listing for users to discover and book.
          </p>
          <button
            onClick={() => navigate("/provider/add-service")}
            className="bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 px-4 rounded hover:opacity-90"
          >
            ➕ Add Service
          </button>
        </div>

        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">View Bookings</h2>
          <p className="text-gray-600 mb-4">
            Track your client appointments and engagements.
          </p>
          <button
            onClick={() => navigate("/provider/bookings")}
            className="bg-[#1c2b21] text-white font-semibold py-2 px-4 rounded hover:opacity-90"
          >
            📅 View Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

