// ProviderDashboard.tsx
import GiftListAndConfirm from "../../GiftListAndConfirm";

const ProviderDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, Provider</h1>

      {/* Other dashboard sections */}

      {/* Gift Delivery Confirmation Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Gift Delivery Confirmation</h2>
        <GiftListAndConfirm />
      </section>
    </div>
  );
};

export default ProviderDashboard;



