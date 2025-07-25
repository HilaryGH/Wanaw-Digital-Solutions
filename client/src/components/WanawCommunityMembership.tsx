import  { useState,  } from "react";
import type { FormEvent} from "react"


const healthcareSpecializations = [
  "Medical Doctor",
  "Nurse",
  "Health Officer",
  "Pharmacist",
];

const freshGraduateSpecializations = [
  "IT",
  "Marketing",
  "Digital Marketing",
  "Finance Analyst",
  "Business Analyst",
  "Graphic Designer",
  "Full Stack Web Developer",
  "Sales",
];

const internshipPeriods = ["1 Month", "2 Months", "3 Months", "6 Months"];

type MemberType = "healthcare" | "freshGraduate";

interface FormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  specialization: string;
  internshipPeriod: string;
  cv: File | null;
  credentials: File | null;
}

export default function WanawCommunityMembership() {
  const [memberType, setMemberType] = useState<MemberType>("healthcare");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    specialization: "",
    internshipPeriod: "",
    cv: null,
    credentials: null,
  });

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement;

  if (target instanceof HTMLInputElement && target.type === "file") {
    const files = target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [target.name]: files[0],
      }));
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  }
};




  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // For demo: just log data
    console.log("Submitted data:", formData);

    // TODO: Add your API call or backend integration here
    alert("Form submitted! Check console for data.");
  };

  const specializations =
    memberType === "healthcare"
      ? healthcareSpecializations
      : freshGraduateSpecializations;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Wanaw Community Membership</h2>

      <div className="flex gap-6 mb-6">
        <label className="inline-flex items-center space-x-2">
          <input
            type="radio"
            value="healthcare"
            checked={memberType === "healthcare"}
            onChange={() => setMemberType("healthcare")}
            className="form-radio"
          />
          <span>Healthcare Professionals</span>
        </label>

        <label className="inline-flex items-center space-x-2">
          <input
            type="radio"
            value="freshGraduate"
            checked={memberType === "freshGraduate"}
            onChange={() => setMemberType("freshGraduate")}
            className="form-radio"
          />
          <span>Fresh Graduates ~ Internship Program</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block font-semibold mb-1">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Current Location */}
        <div>
          <label htmlFor="location" className="block font-semibold mb-1">
            Current Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Areas of Specializations */}
        <div>
          <label
            htmlFor="specialization"
            className="block font-semibold mb-1"
          >
            Areas of Specializations <span className="text-red-600">*</span>
          </label>
          <select
            id="specialization"
            name="specialization"
            required
            value={formData.specialization}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Specialization --</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Internship Period */}
        <div>
          <label
            htmlFor="internshipPeriod"
            className="block font-semibold mb-1"
          >
            Internship Period <span className="text-red-600">*</span>
          </label>
          <select
            id="internshipPeriod"
            name="internshipPeriod"
            required
            value={formData.internshipPeriod}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Internship Period --</option>
            {internshipPeriods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>

        {/* Upload CV */}
        <div>
          <label
            htmlFor="cv"
            className="block font-semibold mb-1"
          >
            Upload CV <span className="text-red-600">*</span>
          </label>
          <input
            id="cv"
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Upload Credentials */}
        <div>
          <label
            htmlFor="credentials"
            className="block font-semibold mb-1"
          >
            Upload Credentials <span className="text-red-600">*</span>
          </label>
          <input
            id="credentials"
            name="credentials"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-green text-gold rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

