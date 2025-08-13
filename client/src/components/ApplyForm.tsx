import { useEffect, useState } from 'react';
import BASE_URL from '../api/api';

interface Application {
  _id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  specialization: string;
  employmentModel: string;
  cvPath?: string;
  credentialsPath?: string;
}

const ApplicationsList = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search input

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/applications`);
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      }
    };

    fetchApplications();
  }, []);

  // Filter by search term (jobId or applicant name)
  const filteredApplications = applications.filter(app => {
    const term = searchTerm.toLowerCase();
    return (
      app.jobId.toLowerCase().includes(term) ||
      app.fullName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Applications</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Job ID or Name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-xl shadow-sm"
      />

      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map(app => (
            <div
              key={app._id}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800">{app.fullName}</h3>
              <p>Email: {app.email}</p>
              <p>Phone: {app.phone}</p>
              <p>Location: {app.currentLocation}</p>
              <p>Specialization: {app.specialization}</p>
              <p>Employment Model: {app.employmentModel}</p>
              <p>Job ID: {app.jobId}</p>

              <div className="mt-3 space-x-4">
                {app.cvPath && (
                  <a
                    href={`${BASE_URL.replace('/api', '')}/${app.cvPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View CV
                  </a>
                )}
                {app.credentialsPath && (
                  <a
                    href={`${BASE_URL.replace('/api', '')}/${app.credentialsPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline"
                  >
                    View Credentials
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;

