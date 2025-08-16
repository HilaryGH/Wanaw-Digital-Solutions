import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../api/api';

interface Application {
  _id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone?: string;
  currentLocation?: string;
  specialization?: string;
  employmentModel?: string;
  cvPath?: string;
  credentialsPath?: string;
}

const ApplicationsList = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/applications`);
        setApplications(res.data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = jobId
    ? applications.filter(app => app.jobId === jobId)
    : applications;

  const handleSendEmail = async () => {
    if (!subject || !message) return alert('Subject and message are required!');
    try {
      setSending(true);
      await axios.post(`${BASE_URL}/applications/notify`, { subject, message });
      alert('✅ Emails sent successfully!');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Send email error:', err);
      alert('❌ Failed to send emails.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      {/* Email Form */}
      <div className="mb-8 p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Send Email to Applicants</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Email Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none md:h-12"
          />
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Applications</h2>
      {filteredApplications.length === 0 ? (
        <p className="text-center text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Full Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Phone</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Location</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Specialization</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Employment Model</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app, idx) => (
                <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4 text-sm">{idx + 1}</td>
                  <td className="py-2 px-4 text-sm">{app.fullName}</td>
                  <td className="py-2 px-4 text-sm">
                    <a href={`mailto:${app.email}`} className="text-blue-600 underline">
                      {app.email}
                    </a>
                  </td>
                  <td className="py-2 px-4 text-sm">{app.phone || '-'}</td>
                  <td className="py-2 px-4 text-sm">{app.currentLocation || '-'}</td>
                  <td className="py-2 px-4 text-sm">{app.specialization || '-'}</td>
                  <td className="py-2 px-4 text-sm">{app.employmentModel || '-'}</td>
                  <td className="py-2 px-4 text-sm space-y-1">
                    {app.cvPath && (
                      <a
                        href={`${BASE_URL.replace('/api', '')}/${app.cvPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline block"
                      >
                        CV
                      </a>
                    )}
                    {app.credentialsPath && (
                      <a
                        href={`${BASE_URL.replace('/api', '')}/${app.credentialsPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline block"
                      >
                        Credentials
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;



