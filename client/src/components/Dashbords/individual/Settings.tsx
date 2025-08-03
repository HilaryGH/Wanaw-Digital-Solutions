import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type UserProfile = {
  fullName: string;
  email: string;
  phone?: string;
  // Add other fields you support
};

type SettingsProps = {
  userId: string;
};

const Settings = ({ userId }: SettingsProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    axios
      .get<UserProfile>(`${BASE_URL}/users/${userId}`)
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch(() => setError("Failed to load user profile"));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`${BASE_URL}/users/${userId}`, formData);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
