import  { useState } from 'react';
import BASE_URL from '../../../api/api';

type EmploymentModel = 'Full Time' | 'Freelance' | 'Part-Time' | 'Remote' | 'On Demand';

const employmentOptions: EmploymentModel[] = ['Full Time', 'Freelance', 'Part-Time', 'Remote', 'On Demand'];

const specializations = [
  'Software Developer',
  'Graphic Designer',
  'Project Manager',
  'Marketing Specialist',
  // add more here...
];

const AdminJobPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [employmentModel, setEmploymentModel] = useState<EmploymentModel | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !employmentModel || !specialization) {
      setMessage('Please fill all required fields.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, location, employmentModel, specialization }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Job posted successfully!');
        setTitle('');
        setDescription('');
        setLocation('');
        setEmploymentModel('');
        setSpecialization('');
      } else {
        setMessage(data.msg || 'Error posting job');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-semibold">Job Title *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Location</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Employment Model *</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={employmentModel}
            onChange={e => setEmploymentModel(e.target.value as EmploymentModel)}
            required
          >
            <option value="">-- Select Employment Model --</option>
            {employmentOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Specialization *</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            required
          >
            <option value="">-- Select Specialization --</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AdminJobPost;
