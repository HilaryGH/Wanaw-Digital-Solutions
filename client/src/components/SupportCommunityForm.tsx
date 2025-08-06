import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const SupportCommunityForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    region: "",
    userType: "individual",
    message: "",
    supportTypes: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && name === "supportTypes" && e.target instanceof HTMLInputElement) {
      const { checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        supportTypes: checked
          ? [...prev.supportTypes, value]
          : prev.supportTypes.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/support-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Submission failed");

      alert("Thank you for joining the Support Community!");
      navigate("/community/hemodialysis");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Brand Decorations */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#1c2b21] rounded-full opacity-40 animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#1c2b21] rounded-full opacity-30 animate-spin-slow z-0"></div>
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#1c2b21] rounded-full opacity-40 animate-pulse z-0"></div>
      <div className="absolute -top-10 right-10 w-32 h-32 bg-[#D4AF37] rotate-45 rounded-lg opacity-50 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-2xl bg-white shadow-2xl rounded-xl p-8 space-y-4 relative"
      >
        <div className="absolute -top-5 left-5 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-md">
          Join Support Community
        </div>

        <h2 className="text-3xl font-bold text-center text-[#1c2b21]">
          Wanaw Lewegenachen Hiwot
        </h2>
        <p className="text-center font-bold text-gold mb-4 text-lg">“ዋናው ለወገናችን ሂወት”</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <input
            name="whatsapp"
            placeholder="WhatsApp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <input
            name="telegram"
            placeholder="Telegram"
            value={formData.telegram}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <input
            name="region"
            placeholder="City / Region"
            value={formData.region}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          >
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">How would you like to support?</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {["Gifter", "Influencer", "Brand Ambassador", "Service Provider", "Volunteer"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="supportTypes"
                  value={type}
                  onChange={handleChange}
                  checked={formData.supportTypes.includes(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <textarea
          name="message"
          placeholder="Message or additional info..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 rounded-full hover:rounded-md transition"
        >
          Join Community
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Ⓒ All rights reserved by Wanaw
        </p>
      </form>
    </div>
  );
};

export default SupportCommunityForm;
