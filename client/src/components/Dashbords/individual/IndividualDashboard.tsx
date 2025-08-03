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
    <>
      <Navbar />
      <Sidebar />
      <div className="md:ml-64 p-4 space-y-6">
        <GiftActivity userId={userId} />
        <Notifications userId={userId} />
        <PaymentSummary userId={userId} />
      </div>
    </>
  );
};

export default IndividualDashboard;






