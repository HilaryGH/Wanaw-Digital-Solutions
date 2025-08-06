import { useState, type ChangeEvent, type FormEvent } from "react";
import BASE_URL from "../api/api";

const DiasporaJoinForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    country: "",
    profession: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BASE_URL}/diaspora-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");

      setSuccess("Thanks for joining the Diaspora Community!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        telegram: "",
        country: "",
        profession: "",
        message: "",
      });
    } catch (err: any) {
      console.error(err);
      setError("Submission failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-xl relative z-10">
        <div className="absolute -top-5 left-5 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-md">
          Diaspora Network
        </div>

        <div className="flex justify-center mb-6">
          <img
            src="/WHW.jpg"
            alt="Wanaw Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center text-[#1c2b21]">
          Join Diaspora Community
        </h2>

        <p className="text-center text-gray-600 text-sm mb-6">
          Fill out the form below to become part of the global network
        </p>

        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-sm text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formData.phone}
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <input
            name="whatsapp"
            placeholder="WhatsApp"
            onChange={handleChange}
            value={formData.whatsapp}
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <input
            name="telegram"
            placeholder="Telegram"
            onChange={handleChange}
            value={formData.telegram}
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <input
            name="country"
            placeholder="Country of Residence"
            onChange={handleChange}
            value={formData.country}
            required
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <input
            name="profession"
            placeholder="Profession / Expertise"
            onChange={handleChange}
            value={formData.profession}
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400"
          />
          <textarea
            name="message"
            placeholder="Why do you want to join?"
            onChange={handleChange}
            value={formData.message}
            className="p-2 border border-gray-300 rounded-md text-sm resize-none h-24 focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="bg-[#D4AF37] text-white font-semibold py-2 rounded-full hover:rounded-md transition"
          >
            Join
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Ⓒ All rights reserved by Wanaw
        </p>
      </div>
    </div>
  );
};

export default DiasporaJoinForm;
