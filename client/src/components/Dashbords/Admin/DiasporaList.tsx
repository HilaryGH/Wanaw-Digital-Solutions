import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api/api";

type DiasporaMember = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  profession?: string;
};

const DiasporaList = () => {
  const [members, setMembers] = useState<DiasporaMember[]>([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/diaspora-members/all`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("Diaspora fetch error:", err));
  }, []);

  return (
    <div className="overflow-x-auto p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Diaspora Members</h2>
      {members.length === 0 ? (
        <p className="text-center">No members found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">#</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">Country</th>
              <th className="border px-4 py-2 text-left">Profession</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={member._id}>
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{member.name}</td>
                <td className="border px-4 py-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 underline"
                  >
                    {member.email}
                  </a>
                </td>
                <td className="border px-4 py-2">{member.phone || "-"}</td>
                <td className="border px-4 py-2">{member.country || "-"}</td>
                <td className="border px-4 py-2">{member.profession || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DiasporaList;


