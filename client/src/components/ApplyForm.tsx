import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api/api';

const ApplyForm = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    currentLocation: '',
    specialization: '',
    employmentModel: '',
    cv: null as File | null,
    credentials: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) submissionData.append(key, value as string | Blob);
    });

    try {
      await axios.post(`${BASE_URL}/applications/${jobId}`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('🎉 Application submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('❌ Submission failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 px-6 py-10 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl rounded-2xl border border-blue-100">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Apply for the Job</h2>
      <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1 md:grid-cols-2" encType="multipart/form-data">
        {[
          { name: "fullName", type: "text", placeholder: "Full Name" },
          { name: "email", type: "email", placeholder: "Email" },
          { name: "phone", type: "text", placeholder: "Phone" },
          { name: "whatsapp", type: "text", placeholder: "WhatsApp" },
          { name: "currentLocation", type: "text", placeholder: "Current Location" },
        ].map(({ name, type, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
              {placeholder}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={(formData as any)[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
              required={name === "fullName" || name === "email"}
            />
          </div>
        ))}

        {[
          { name: "cv", label: "CV (PDF, DOC)" },
          { name: "credentials", label: "Credentials (PDF, DOC)" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <input
              id={name}
              name={name}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm"
              required
            />
          </div>
        ))}

        <div>
          <label htmlFor="specialization" className="block mb-1 text-sm font-medium text-gray-700">Specialization</label>
          <select
            name="specialization"
            id="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          >
            <option value="">Select Specialization</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Designer">Designer</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label htmlFor="employmentModel" className="block mb-1 text-sm font-medium text-gray-700">Employment Model</label>
          <select
            name="employmentModel"
            id="employmentModel"
            value={formData.employmentModel}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
          >
            <option value="">Select Employment Model</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Freelance">Freelance</option>
            <option value="Remote">Remote</option>
            <option value="On Demand">On Demand</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            🚀 Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;



