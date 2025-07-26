import { useEffect, useState } from "react";
import BASE_URL from "../../../api/api";


type Member = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  memberType: string;
  cvUrl?: string;
  credentialsUrl?: string;
};

const CommunityList = () => {
 const [members, setMembers] = useState<Member[]>([]);


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/community`);
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Community Members</h2>
      <table className="min-w-full table-auto border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Specialization</th>
            <th className="border p-2">Member Type</th>
            <th className="border p-2">CV</th>
            <th className="border p-2">Credentials</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member._id || index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.email}</td>
              <td className="border p-2">{member.phone}</td>
              <td className="border p-2">{member.location}</td>
              <td className="border p-2">{member.specialization}</td>
              <td className="border p-2">{member.memberType}</td>
              <td className="border p-2 text-blue-600">
                {member.cvUrl ? (
                  <a href={member.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>

                ) : (
                  "N/A"
                )}
              </td>
              <td className="border p-2 text-blue-600">
                {member.credentialsUrl ? (
                  <a href={member.credentialsUrl} target="_blank" rel="noopener noreferrer">View Credentials</a>

                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommunityList;
