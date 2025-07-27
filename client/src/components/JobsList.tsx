import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../api/api";
import { useNavigate } from "react-router-dom";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  employmentModel: string;
  specialization: string;
  createdAt: string;
}

const JobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs`);
        setJobs(response.data);
      } catch (err) {
        setError("Failed to fetch jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p>
                  <strong>Location:</strong> {job.location || "Not specified"}
                </p>
                <p>
                  <strong>Employment:</strong> {job.employmentModel}
                </p>
                <p>
                  <strong>Specialization:</strong> {job.specialization}
                </p>
                <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                  {job.description || "No description provided"}
                </p>
              </div>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                onClick={() => navigate(`/career/${job._id}`)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsList;


