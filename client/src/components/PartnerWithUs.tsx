import { useState } from "react";
import axios from "axios";
import BASE_URL from "../api/api";

export default function PartnerWithUs() {
  const [tab, setTab] = useState<"Investor" | "Strategic Partner" | "Co Branding">("Investor");

  const investmentOptions = ["Equity", "Debt", "Convertible Bonds"];
 const sectorOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Real Estate",
  "Education",
  "Hospitality & Tourism",
  "Agriculture",
  "Media & Entertainment",
  "Construction"
];


  const [formData, setFormData] = useState({
    investmentType: "",
    sector: "",
    name: "",
    companyName: "",
    email: "",
    phone: "",
    officePhone: "",
    whatsapp: "",
    enquiry: "",
    motto: "",
    specialPackages: "",
    messages: "",
    coBrand: "",
    effectiveDate: "",
    expiryDate: "",
  });

  const [files, setFiles] = useState({
    idOrPassport: null,
    license: null,
    tradeRegistration: null,
    businessProposal: null,
    businessPlan: null,
    logo: null,
    mouSigned: null,
    contractSigned: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: inputFiles?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("tab", tab);

      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
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
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-24 sm:w-40 h-24 sm:h-40 bg-[#1c2b21] rounded-full opacity-30 animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-40 sm:w-60 h-40 sm:h-60 bg-[#1c2b21] rounded-full opacity-20 animate-spin-slow z-0"></div>

      <section className="z-10 w-full max-w-5xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 space-y-6 relative">
        <div className="absolute -top-5 left-5 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-md">
          Partner With Us
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1c2b21] mb-6">
          Invest / Partner With Us
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-6 gap-3">
          {["Investor", "Strategic Partner", "Co Branding"].map(role => (
            <button
              key={role}
              onClick={() => setTab(role as any)}
              className={`px-4 py-2 rounded transition ${
                tab === role ? "bg-green text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {/* Investor / Strategic Partner Fields */}
          {(tab === "Investor" || tab === "Strategic Partner") && (
            <>
              {/* Sector Dropdown */}
              <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-medium">Sector</label>
                <select name="sector" value={formData.sector} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required>
                  <option value="">-- Select Sector --</option>
                  {sectorOptions.map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Investment Type for Investors */}
              {tab === "Investor" && (
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium">Investment Type</label>
                  <select name="investmentType" value={formData.investmentType} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded">
                    <option value="">-- Select Investment Type --</option>
                    {investmentOptions.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Basic Inputs */}
              {["name", "companyName", "email", "phone", "whatsapp"].map(field => (
                <div key={field}>
                  <label className="block mb-1 text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>
              ))}

              {/* Common File Uploads */}
              <div className="sm:col-span-2 mt-4">
                <label className="block mb-2 font-medium text-sm">Attachments</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[{ label: "ID / Passport / Driving Licence", name: "idOrPassport" }, { label: "License", name: "license" }, { label: "Trade Registration", name: "tradeRegistration" }].map(({ label, name }) => (
                    <div key={name}>
                      <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
                      <input type="file" name={name} accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="w-full border border-gray-300 p-1 rounded text-sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Partner Specific Uploads */}
              {tab === "Strategic Partner" && (
                <div className="sm:col-span-2 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{ label: "Project / Business Proposal", name: "businessProposal" }, { label: "Business Plan", name: "businessPlan" }].map(({ label, name }) => (
                      <div key={name}>
                        <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
                        <input type="file" name={name} accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full border border-gray-300 p-1 rounded text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enquiry */}
              <div className="sm:col-span-2 mt-4">
                <label className="block mb-1 text-sm font-medium">Enquiries</label>
                <textarea rows={4} name="enquiry" value={formData.enquiry} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" placeholder="Type your message..."></textarea>
              </div>
            </>
          )}

          {/* Co Branding & Promotion Section */}
          {tab === "Co Branding" && (
            <>
              {["name", "email", "phone", "officePhone", "whatsapp",].map(field => (
                <div key={field}>
                  <label className="block mb-1 text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input type="text" name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required />
                </div>
              ))}

              {/* Logo Upload */}
              <div>
                <label className="block mb-1 text-sm font-medium">Logo</label>
                <input type="file" name="logo" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded" />
              </div>

              {/* Motto, Special Packages, Messages */}
              {["motto", "specialPackages", "messages"].map(field => (
                <div key={field} className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <textarea rows={3} name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
                </div>
              ))}

              {/* Effective & Expiry Dates */}
              {["effectiveDate", "expiryDate"].map(field => (
                <div key={field}>
                  <label className="block mb-1 text-sm font-medium">{field === "effectiveDate" ? "Effective Date" : "Expiry Date"}</label>
                  <input type="date" name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
                </div>
              ))}

              {/* Attachments: MOU & Contract */}
              <div className="sm:col-span-2 mt-4">
                <label className="block mb-2 font-medium text-sm">Attachments</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ label: "MOU Signed", name: "mouSigned" }, { label: "Contract Agreement Signed", name: "contractSigned" }].map(({ label, name }) => (
                    <div key={name}>
                      <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
                      <input type="file" name={name} accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full border border-gray-300 p-1 rounded text-sm" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <div className="sm:col-span-2 text-center mt-6">
            <button type="submit" className="bg-[#1c2b21] text-white px-6 py-3 rounded hover:bg-[#0f1a14] transition w-full sm:w-auto">
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
