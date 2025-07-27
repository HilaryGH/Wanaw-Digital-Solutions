import { useState } from "react";
import Navbar from "../Navbar";
import AddServiceForm from "../../Services/AddServiceForm";
import { Plus, Gift } from "lucide-react";
import GiftListForProvider from "./GiftListForProvider";

const ProviderDashboard = () => {
  const [activeSection, setActiveSection] = useState<"add" | "confirm" | null>(null);

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#1c2b21]">Provider Dashboard</h1>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Service Card */}
          <div
            className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition"
            onClick={() => setActiveSection("add")}
          >
            <div className="flex items-center gap-4 mb-4">
              <Plus className="text-blue-600" size={28} />
              <h2 className="text-xl font-semibold text-[#1c2b21]">Add New Service</h2>
            </div>
            <p className="text-gray-600">Create and submit a new service for users to explore.</p>
          </div>

          {/* Confirm Gift Delivery Card */}
          <div
            className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition"
            onClick={() => setActiveSection("confirm")}
          >
            <div className="flex items-center gap-4 mb-4">
              <Gift className="text-purple-600" size={28} />
              <h2 className="text-xl font-semibold text-[#1c2b21]">Confirm Gift Delivery</h2>
            </div>
            <p className="text-gray-600">Review and confirm gift deliveries from users.</p>
          </div>
        </div>

        {/* Active Section Rendering */}
        <div className="mt-10">
          {activeSection === "add" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#1c2b21]">Add Service</h3>
              <AddServiceForm />
            </div>
          )}

          {activeSection === "confirm" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#1c2b21]">Confirm Gift Delivery</h3>
              <GiftListForProvider/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderDashboard;




