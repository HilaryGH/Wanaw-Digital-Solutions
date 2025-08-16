import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import GiftActivity from "./GiftActivity";
import Notifications from "./Notifications";
import PaymentSummary from "./PaymentSummary";
import Sidebar from "./Sidebar";

type LocationState = {
  userId: string;
};

const IndividualDashboard = () => {
  const location = useLocation();
  const { userId } = location.state as LocationState;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navigation */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-64 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here’s what’s happening today.
            </p>
          </header>

          {/* Dashboard Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
              <GiftActivity userId={userId} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
              <Notifications userId={userId} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
              <PaymentSummary userId={userId} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default IndividualDashboard;









