import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "provider") {
      alert("Access denied. You must be a service provider.");
      navigate("/membership"); // redirect to upgrade
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] text-[#1c2b21] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user.fullName || "Provider"} 🎉
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Membership: <strong>{user.membership?.toUpperCase()}</strong>
        </p>
        <Link
          to="/provider/add-service"
          className="bg-[#D4AF37] text-[#1c2b21] px-6 py-2 rounded font-semibold"
        >
          ➕ Add New Service
        </Link>
      </div>
    </div>
  );
};

export default ProviderDashboard;
