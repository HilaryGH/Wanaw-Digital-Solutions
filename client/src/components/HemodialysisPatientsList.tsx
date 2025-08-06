import React, { useEffect, useState } from "react";

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

  if (loading) return <div className="text-center mt-10">Loading patients...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#1c2b21]">Hemodialysis Patients Needing Support</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#1c2b21]">{patient.name}, {patient.age ?? "N/A"}</h3>
              <p className="text-gray-700 mb-1"><strong>Facility:</strong> {patient.facilityName}</p>
              <p className="text-gray-700 mb-1"><strong>Location:</strong> {patient.location}</p>
              <p className="text-gray-700 mb-3">{patient.message || "No additional info provided."}</p>

              <div className="mb-4">
                <strong>Contact Info:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>Phone: {patient.phone}</li>
                  <li>WhatsApp: {patient.whatsapp}</li>
                  <li>Telegram: {patient.telegram}</li>
                  <li>Email: <a href={`mailto:${patient.email}`} className="text-blue-600 underline">{patient.email}</a></li>
                </ul>
              </div>

              <div>
                <strong>Documents:</strong>
                <ul className="mt-1 space-y-1">
                  <li>
                    <a
                      href={`http://localhost:5000/uploads/${patient.idDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ID Document
                    </a>
                  </li>
                  <li>
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

              {patient.videos.length > 0 && (
                <div className="mt-4">
                  <strong>Videos:</strong>
                  <div className="flex flex-col gap-2 mt-1">
                    {patient.videos.map((video, idx) => (
                      <video
                        key={idx}
                        controls
                        className="w-full rounded border border-gray-300"
                        src={`http://localhost:5000/uploads/${video}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-[#D4AF37] text-[#1c2b21] text-center py-3 font-semibold cursor-pointer hover:bg-yellow-400 transition">
              {/* Replace this with your donation action/link */}
              <button onClick={() => alert("Donation feature coming soon!")}>
                Donate to {patient.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HemodialysisPatientsList;
