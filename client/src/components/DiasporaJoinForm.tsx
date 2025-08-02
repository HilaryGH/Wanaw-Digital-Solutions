import { useState, type ChangeEvent, type FormEvent } from "react";
import BASE_URL from "../api/api";

const DiasporaJoinForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    profession: "",
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    fetch(`${BASE_URL}/diaspora-members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => alert("Thanks for joining the Diaspora Community!"))
      .catch(() => alert("Submission failed"));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6 grid gap-4">
      <h2 className="text-xl font-bold text-green text-center">Join Diaspora Community</h2>
      <input name="name" placeholder="Full Name" required onChange={handleChange} className="p-2 border rounded" />
      <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="p-2 border rounded" />
      <input name="phone" placeholder="Phone / WhatsApp" onChange={handleChange} className="p-2 border rounded" />
      <input name="country" placeholder="Country of Residence" required onChange={handleChange} className="p-2 border rounded" />
      <input name="profession" placeholder="Profession / Expertise" onChange={handleChange} className="p-2 border rounded" />
      <textarea name="message" placeholder="Why do you want to join?" onChange={handleChange} className="p-2 border rounded" />
      <button type="submit" className="bg-green text-gold py-2 rounded hover:bg-blue-700">Join</button>
    </form>
  );
};
export default DiasporaJoinForm;
