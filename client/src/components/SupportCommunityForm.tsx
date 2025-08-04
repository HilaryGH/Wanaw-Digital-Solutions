import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const SupportCommunityForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    message: "",
    supportTypes: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!res.ok) {
      throw new Error("Submission failed");
    }

    alert("Thank you for joining the Support Community!");

    // Navigate to /services page after successful submission
    navigate("/services");

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <>
      <div className="text-center mb-4 p-4 bg-green rounded">
        <h1 className="text-xl font-bold text-gold">Wanaw Lewegenachen Hiwot</h1>
        <p className="text-gold text-lg">"ዋናው ለወገናችን ሂወት"</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold text-center">Join Our Support Community</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <input
          type="text"
          name="region"
          placeholder="City / Region"
          value={formData.region}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <div className="space-y-2">
          <label className="block font-medium">How do you want to support?</label>
          <label className="flex items-center gap-2">
  <input
    type="checkbox"
    name="supportTypes"
    value="Gifter"
    onChange={handleChange}
  />
  Gifter
</label>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    name="supportTypes"
    value="Influencer"
    onChange={handleChange}
  />
  Influencer
</label>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    name="supportTypes"
    value="Brand Ambassador"
    onChange={handleChange}
  />
  Brand Ambassador
</label>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    name="supportTypes"
    value="Service Provider"
    onChange={handleChange}
  />
  Service Provider
</label>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    name="supportTypes"
    value="Volunteer"
    onChange={handleChange}
  />
  Volunteer
</label>

        </div>

        <textarea
          name="message"
          placeholder="Any message or additional info?"
          value={formData.message}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
          rows={4}
        />

        <button
          type="submit"
          className="w-full bg-[#1c2b21] text-white py-2 rounded hover:bg-[#2a3d30] transition duration-300"
        >
          Join Community
        </button>
      </form>
    </>
  );
};

export default SupportCommunityForm;
