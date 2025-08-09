import React, { useEffect, useState } from "react";
import { Mail, Phone, MessageCircle, Send, FileText } from "lucide-react";

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

const HemodialysisPatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/kidney-patients")
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

  if (loading) return <div className="text-center mt-10 text-lg text-gray-600">Loading patients...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

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
                  src={`http://localhost:5000/uploads/${patient.videos[0]}`}
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Patient Info */}
              <h3 className="text-2xl font-semibold text-[#1c2b21]">
                {patient.name}{" "}
                <span className="text-gray-500 text-lg">
                  ({patient.age ?? "N/A"} yrs)
                </span>
              </h3>
              <p className="text-gray-700"><strong>Facility:</strong> {patient.facilityName}</p>
              <p className="text-gray-700"><strong>Location:</strong> {patient.location}</p>
              <p className="text-gray-600 italic">
                {patient.message || "No additional info provided."}
              </p>

              {/* Contact Info */}
              <div className="space-y-1">
                <strong className="block text-gray-800 mb-1">Contact Info:</strong>
                <ul className="text-gray-600 space-y-1">
                  <li className="flex items-center gap-2"><Phone size={16}/> {patient.phone}</li>
                  <li className="flex items-center gap-2"><MessageCircle size={16}/> {patient.whatsapp}</li>
                  <li className="flex items-center gap-2"><Send size={16}/> {patient.telegram}</li>
                  <li className="flex items-center gap-2">
                    <Mail size={16}/> 
                    <a href={`mailto:${patient.email}`} className="text-blue-600 underline">
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
                    <FileText size={16}/>
                    <a
                      href={`http://localhost:5000/uploads/${patient.idDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ID Document
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16}/>
                    <a
                      href={`http://localhost:5000/uploads/${patient.medicalCertificate}`}
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

            {/* Send Gift Button */}
            <div className="bg-[#D4AF37] text-[#1c2b21] text-center py-3 font-semibold cursor-pointer hover:bg-yellow-400 transition">
              <button onClick={() => alert(`Send gift feature coming soon for ${patient.name}!`)}>
                🎁 Send Gift to {patient.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HemodialysisPatientsList;


