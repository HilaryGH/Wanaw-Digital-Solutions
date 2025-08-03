import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type PaymentSummaryData = {
  totalPaid: number;
  lastPaymentDate: string;
  // Add other fields if any
};

type PaymentSummaryProps = {
  userId: string;
};

const PaymentSummary = ({ userId }: PaymentSummaryProps) => {
  const [summary, setSummary] = useState<PaymentSummaryData | null>(null);

  useEffect(() => {
    axios
      .get<PaymentSummaryData>(`${BASE_URL}/payment/${userId}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Payment fetch error:", err));
  }, [userId]);

  if (!summary) return <div className="text-center">Loading Payment Summary...</div>;

  return (
    <div className="p-6 bg-white rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
      <p>Total Paid: <strong>{summary.totalPaid} ETB</strong></p>
      <p>Last Payment: {new Date(summary.lastPaymentDate).toLocaleDateString()}</p>
    </div>
  );
};

export default PaymentSummary;


