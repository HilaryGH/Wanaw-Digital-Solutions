import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import BASE_URL from "../api/api";

interface KidneyPatientFormData {
  name: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  facility: string;
  location: string;
  message: string;
  idDocument: File | null;
  medicalCertificate: File | null;
  videos: FileList | null;
}

const KidneyPatientForm: React.FC = () => {
  const [formData, setFormData] = useState<KidneyPatientFormData>({
    name: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    email: "",
    facility: "",
    location: "",
    message: "",
    idDocument: null,
    medicalCertificate: null,
    videos: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    if (name === "videos") {
      setFormData((prev) => ({ ...prev, videos: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("phone", formData.phone);
    form.append("whatsapp", formData.whatsapp);
    form.append("telegram", formData.telegram);
    form.append("email", formData.email);
    form.append("facility", formData.facility);
    form.append("location", formData.location);
    form.append("message", formData.message);

    if (formData.idDocument) form.append("idDocument", formData.idDocument);
    if (formData.medicalCertificate) form.append("medicalCertificate", formData.medicalCertificate);
    if (formData.videos) {
      Array.from(formData.videos).forEach((video) => {
        form.append("videos", video);
      });
    }

    try {
      const res = await fetch(`${BASE_URL}/kidney-patients`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      alert("Submission successful");
      console.log(data);
    } catch (err: any) {
      console.error(err);
      alert(`Submission failed: ${err.message}`);
    }
  };

  return (
    <>
      <div className="text-center mb-4 p-4 bg-green rounded">
        <h1 className="text-xl font-bold text-gold">Wanaw Lewegenachen Hiwot</h1>
        <p className="text-gold text-lg">"ዋናው ለወገናችን ሂወት"</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 p-6 bg-white rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-semibold text-center">Hemodialysis Patient Submission Form</h2>

        <input name="name" placeholder="Kidney Patient Name" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <input name="phone" placeholder="Phone" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <input name="whatsapp" placeholder="WhatsApp" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <input name="telegram" placeholder="Telegram" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <input name="facility" placeholder="Health Facility Center Name" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <input name="location" placeholder="Location" onChange={handleChange} required className="p-2 border rounded border-gray-500" />
        <textarea name="message" placeholder="Message or Additional Info" onChange={handleChange} className="p-2 rounded border border-gray-500" />

        <label>ID / Driving Licence / Passport:</label>
        <input type="file" name="idDocument" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="p-2 border border-gray-300" required />

        <label>Medical Certificate:</label>
        <input type="file" name="medicalCertificate" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="p-2 border border-gray-300" required />

        <label>Video (30s to 1min):</label>
        <input type="file" name="videos" accept="video/*" multiple onChange={handleFileChange} className="p-2 border border-gray-300" />

        <button type="submit" className="bg-green text-gold py-2 rounded hover:bg-blue-700">Submit</button>
      </form>
    </>
  );
};

export default KidneyPatientForm;

