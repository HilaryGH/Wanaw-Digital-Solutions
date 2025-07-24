import { useState } from "react";
import axios from "axios";
import BASE_URL from "../api/api";

export default function PartnerWithUs() {
  const [tab, setTab] = useState<"Investor" | "Strategic Partner">("Investor");

  const investmentOptions = [
    "Equity",
    "Debt",
    "Other Alternative Investment",
  ];

  const [formData, setFormData] = useState({
    investmentType: "",
    name: "",
    companyName: "",
    email: "",
    phone: "",
    whatsapp: "",
    enquiry: "",
  });

  const [files, setFiles] = useState({
    idOrPassport: null,
    license: null,
    tradeRegistration: null,
    businessProposal: null,
    businessPlan: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: inputFiles?.[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("tab", tab);
      if (tab === "Investor") {
        data.append("investmentType", formData.investmentType);
      }

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

   await axios.post(`${BASE_URL}/partner-request`, data);
alert("🎉 Partner request submitted successfully!");

    } catch (err) {
      console.error("Submit error", err);
      alert("❌ Failed to submit. Please try again.");
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6 my-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Invest/Partner With Us
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        {["Investor", "Strategic Partner"].map((role) => (
          <button
            key={role}
            onClick={() => setTab(role as "Investor" | "Strategic Partner")}
            className={`px-4 py-2 rounded ${
              tab === role
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {/* Investment Type */}
        {tab === "Investor" && (
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium">Investment Type</label>
            <select
              name="investmentType"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formData.investmentType}
            >
              <option value="">-- Select Investment Type --</option>
              {investmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {/* Text Inputs */}
        {["name", "companyName", "email", "phone", "whatsapp"].map((field) => (
          <div key={field}>
            <label className="block mb-1 text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type="text"
              name={field}
              placeholder={`Enter your ${field}`}
              className="w-full border p-2 rounded"
              value={(formData as any)[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Common Uploads */}
        <div className="sm:col-span-2 mt-4">
          <label className="block mb-2 font-medium text-sm">Attachments</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "ID / Passport / Driving Licence", name: "idOrPassport" },
              { label: "License", name: "license" },
              { label: "Trade Registration", name: "tradeRegistration" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
                <input
                  type="file"
                  name={name}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full border p-1 rounded text-sm"
                  onChange={handleFileChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Partner Uploads */}
        {tab === "Strategic Partner" && (
          <div className="sm:col-span-2 mt-4">
            <label className="block mb-2 font-medium text-sm">To be attached:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Project / Business Proposal", name: "businessProposal" },
                { label: "Business Plan", name: "businessPlan" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
                  <input
                    type="file"
                    name={name}
                    accept=".pdf,.doc,.docx"
                    className="w-full border p-1 rounded text-sm"
                    onChange={handleFileChange}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enquiries */}
        <div className="sm:col-span-2 mt-4">
          <label className="block mb-1 text-sm font-medium">Enquiries</label>
          <textarea
            rows={4}
            name="enquiry"
            className="w-full border p-2 rounded"
            placeholder="Type your message..."
            value={formData.enquiry}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
