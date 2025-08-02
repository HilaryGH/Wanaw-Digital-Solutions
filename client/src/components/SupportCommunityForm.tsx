import React, { useState } from "react";
import BASE_URL from "../api/api";

interface SupportCommunityFormData {
  name: string;
  email: string;
  phone: string;
  region: string;
  supportTypes: string[]; // e.g., ["Donate", "Volunteer"]
  message: string;
}

const SupportCommunityForm: React.FC = () => {
  const [formData, setFormData] = useState<SupportCommunityFormData>({
    name: "",
    email: "",
    phone: "",
    region: "",
    supportTypes: [],
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedSupportTypes = checked
        ? [...prev.supportTypes, value]
        : prev.supportTypes.filter((type) => type !== value);
      return { ...prev, supportTypes: updatedSupportTypes };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(`${BASE_URL}/support-community`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Thank you for joining the Support Community!");
      })
      .catch(() => {
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <>
    <div className="text-center mb-4 p-4 bg-green rounded">
        <h1 className="text-xl font-bold text-gold">Wanaw Lewegenachen Hiwot</h1>
        <p className="text-gold text-lg">"ዋናው ለወገናችን ሂወት"</p>
      </div>

    
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold text-center text-green mb-4">Join the Support Community</h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        Join us to support kidney patients by volunteering, donating, or sharing awareness.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input name="name" placeholder="Full Name" required onChange={handleChange} className="p-2 border rounded border-gray-500" />
        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="p-2 border rounded border-gray-500" />
        <input name="phone" placeholder="Phone / WhatsApp" required onChange={handleChange} className="p-2 border rounded border-gray-500" />
        <input name="region" placeholder="City / Region" required onChange={handleChange} className="p-2 border rounded border-gray-500" />

        <div className="border rounded border-gray-300 p-3">
          <p className="mb-2 font-medium">How would you like to support?</p>
          <label className="block"><input type="checkbox" value="Donate" onChange={handleCheckboxChange} /> Donate</label>
          <label className="block"><input type="checkbox" value="Volunteer" onChange={handleCheckboxChange} /> Volunteer</label>
          <label className="block"><input type="checkbox" value="Spread Awareness" onChange={handleCheckboxChange} /> Spread Awareness</label>
          <label className="block"><input type="checkbox" value="Other" onChange={handleCheckboxChange} /> Other</label>
        </div>

        <textarea name="message" placeholder="Any message or additional info?" onChange={handleChange} className="p-2 border rounded border-gray-500" />

        <button type="submit" className="bg-green text-gold py-2 rounded hover:bg-blue-700">Join & Support</button>
      </form>
    </div>
    </>
  );
};

export default SupportCommunityForm;
