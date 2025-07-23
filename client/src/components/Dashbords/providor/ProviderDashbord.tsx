import ConfirmDelivery from "../../ConfirmDelivery";

const ProviderDashboard = () => {
  const providerId = "your-provider-id"; // This can come from context, auth, or backend

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, Provider</h1>

      {/* Other dashboard sections */}

      {/* Confirm Gift/Service Delivery Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Gift Delivery Confirmation</h2>
        <ConfirmDelivery providerId={providerId} />
      </section>
    </div>
  );
};

export default ProviderDashboard;

