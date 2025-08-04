import { useEffect, useState } from "react";
import BASE_URL from "../../../api/api";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  companyName?: string;
};

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState(""); // Selected role filter
  const [loading, setLoading] = useState(false);

  // Fetch users when role changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const query = role ? `?role=${role}` : "";

        const response = await fetch(`${BASE_URL}/users${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* Role filter dropdown */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="individual">Individual</option>
          <option value="provider">Provider</option>
          <option value="corporate">Corporate</option>
          <option value="diaspora">Diaspora</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Loading indicator */}
      {loading && <p>Loading users...</p>}

      {/* User list */}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        // Wrap table in a container with horizontal scroll for small screens
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">Full Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Company (if provider)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">{user.fullName}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2 capitalize">{user.role}</td>
                  <td className="border p-2">{user.companyName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;

