import React, { useEffect, useState } from "react";
import { Mail, Phone, MessageCircle, Send, FileText } from "lucide-react";
import BASE_URL from "../api/api";

interface Patient {
  _id: string;
  name: string;
  age?: number;
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  facilityName: string;
  location: string;
  message?: string;
  idDocument: string;
  medicalCertificate: string;
  videos: string[];
}

interface UserRoles {
  gifter: boolean;
  influencer: boolean;
  brandAmbassador: boolean;
  serviceProvider: boolean;
  volunteer: boolean;
}

// Load user roles from localStorage or default to false
const getUserRoles = (): UserRoles => {
  const stored = localStorage.getItem("userRoles");
  return stored
    ? JSON.parse(stored)
    : {
        gifter: false,
        influencer: false,
        brandAmbassador: false,
        serviceProvider: false,
        volunteer: false,
      };
};

const HemodialysisPatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRoles] = useState<UserRoles>(getUserRoles());

  useEffect(() => {
    fetch(`${BASE_URL}/kidney-patients`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch patients");
        return res.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching data");
        setLoading(false);
      });
  }, []);

  const fileBase = BASE_URL.replace("/api", "");

  const handleAction = (patient: Patient, action: keyof UserRoles) => {
    switch (action) {
      case "gifter":
        alert(`🎁 Send gift feature coming soon for ${patient.name}!`);
        break;
      case "influencer":
        alert(`📢 Promote ${patient.name} on your platform!`);
        break;
      case "brandAmbassador":
        alert(`🌟 Promote Wanaw Support Community Program for ${patient.name}!`);
        break;
      case "serviceProvider":
        alert(`🏥 Provide treatment or services for ${patient.name}!`);
        break;
      case "volunteer":
        alert(`🤝 Volunteer for ${patient.name}'s care!`);
        break;
      default:
        break;
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Loading patients...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-red-600">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#1c2b21]">
        Hemodialysis Patients Needing Support
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Top Profile Video */}
            {patient.videos.length > 0 && (
              <div className="relative w-full aspect-video bg-gray-100">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={`${fileBase}/uploads/${patient.videos[0]}`}
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#1c2b21]">
                {patient.name}{" "}
                <span className="text-gray-500 text-lg">
                  ({patient.age ?? "N/A"} yrs)
                </span>
              </h3>
              <p className="text-gray-700">
                <strong>Facility:</strong> {patient.facilityName}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {patient.location}
              </p>
              <p className="text-gray-600 italic">
                {patient.message || "No additional info provided."}
              </p>

              {/* Contact Info */}
              <div className="space-y-1">
                <strong className="block text-gray-800 mb-1">
                  Contact Info:
                </strong>
                <ul className="text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <Phone size={16} /> {patient.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle size={16} /> {patient.whatsapp}
                  </li>
                  <li className="flex items-center gap-2">
                    <Send size={16} /> {patient.telegram}
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={16} />
                    <a
                      href={`mailto:${patient.email}`}
                      className="text-blue-600 underline"
                    >
                      {patient.email}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Documents */}
              <div className="space-y-1">
                <strong className="block text-gray-800 mb-1">Documents:</strong>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <FileText size={16} />
                    <a
                      href={`${fileBase}/uploads/${patient.idDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ID Document
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16} />
                    <a
                      href={`${fileBase}/uploads/${patient.medicalCertificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Medical Certificate
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 p-4 bg-[#F5F5F5] border-t">
              {Object.entries(userRoles).map(([role, isActive]) =>
                isActive ? (
                  <button
                    key={role}
                    type="button" // Prevents page refresh
                    onClick={() => handleAction(patient, role as keyof UserRoles)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#D4AF37] text-[#1c2b21] font-semibold hover:rounded-full transition text-sm"
                  >
                    {role === "gifter" && "🎁 Send Gift"}
                    {role === "influencer" && "📢 Promote"}
                    {role === "brandAmbassador" && "🌟 Promote Program"}
                    {role === "serviceProvider" && "🏥 Provide Service"}
                    {role === "volunteer" && "🤝 Volunteer"}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HemodialysisPatientsList;





