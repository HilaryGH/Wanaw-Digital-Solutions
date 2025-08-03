import Navbar from "../Navbar";
import GiftActivity from "./GiftActivity";
import Notifications from "./Notifications";
import PaymentSummary from "./PaymentSummary";
import Sidebar from "./Sidebar";

const IndividualDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block shadow-md bg-white">
          <Sidebar />
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <GiftActivity />
              <Notifications />
            </div>

            {/* Right Column */}
            <div>
              <PaymentSummary />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default IndividualDashboard;




