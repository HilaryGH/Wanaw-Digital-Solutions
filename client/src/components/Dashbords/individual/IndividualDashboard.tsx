import { useState } from "react";
import Navbar from "../Navbar";
import GiftActivity from "./GiftActivity";
import Notifications from "./Notifications";
import PaymentSummary from "./PaymentSummary";
import Account from "./Account";
import Footer from "../../Footer";

type User = {
  _id: string;
  fullName: string;
};

const IndividualDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "gifts" | "notifications" | "payments" | "account"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        <p>User not found. Please login again.</p>
      </div>
    );
  }

  const Sidebar = () => (
    <aside
      className={`
        bg-green text-white w-64 p-6 shadow-md
        fixed md:static top-0 left-0 h-full md:h-auto z-50
        transform md:translate-x-0 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav className="space-y-6 mt-10 md:mt-0">
        {[
          { label: "Dashboard", tab: "dashboard" },
          { label: "My Gifts", tab: "gifts" },
          { label: "🔔 Notifications", tab: "notifications" },
          { label: "Payments", tab: "payments" },
          { label: "⚙️ Account", tab: "account" },
        ].map(({ label, tab }) => (
          <div
            key={tab}
            className={`block text-gold font-semibold cursor-pointer hover:text-yellow-400 ${
              activeTab === tab ? "underline" : ""
            }`}
            onClick={() => {
              setActiveTab(tab as any);
              setSidebarOpen(false); // Close sidebar on mobile
            }}
          >
            {label}
          </div>
        ))}
        <div
          className="block text-gold font-semibold cursor-pointer hover:text-red-400 mt-4"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Logout
        </div>
      </nav>
    </aside>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <GiftActivity userId={user._id} />;
      case "gifts":
        return <GiftActivity userId={user._id} />;
      case "notifications":
        return <Notifications userId={user._id} />;
      case "payments":
        return <PaymentSummary userId={user._id} />;
      case "account":
        return <Account />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col md:flex-row">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex justify-between items-center bg-green p-4">
          <h1 className="text-white font-bold text-lg">Dashboard</h1>
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col  transition-all duration-300">
          <Navbar />

          <main className="p-4 md:p-6 flex-1">
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.fullName}!</p>
            </header>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-5 md:p-6">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IndividualDashboard;











