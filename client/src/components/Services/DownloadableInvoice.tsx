import { useRef } from "react";
import html2pdf from "html2pdf.js";

const DownloadableInvoice = ({ fullName, email, cart, total }: any) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!invoiceRef.current) return;
    html2pdf()
      .from(invoiceRef.current)
      .set({
        filename: `Invoice_${new Date().toISOString().split("T")[0]}.pdf`,
        margin: 10,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div>
      <div ref={invoiceRef} className="bg-white shadow rounded-lg p-6 mb-6">
        {/* 🖼️ Logo at the top */}
  <div className="flex justify-center mb-4">
   <img
            src="/WHW.jpg"
            alt="Wanaw Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
  </div>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">🧾 Invoice Summary</h3>
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> {email}</p>
        <ul className="mt-4">
          {cart.map((item: any, idx: number) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>{item.title}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 font-semibold border-t pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="bg-green text-gold px-4 py-2 mb-4 rounded hover:bg-green-700"
      >
        📥 Download Invoice
      </button>
    </div>
  );
};

export default DownloadableInvoice;

