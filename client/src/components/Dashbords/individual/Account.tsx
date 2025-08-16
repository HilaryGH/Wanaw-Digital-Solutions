import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../../api/api";

// Define user type
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  membership: string;
  companyName?: string;
  phone?: string;
  city?: string;
  location?: string;
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Welcome, {user.fullName}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Membership: {user.membership}</p>
      {user.companyName && <p>Company: {user.companyName}</p>}
      {user.phone && <p>Phone: {user.phone}</p>}
      {user.city && <p>City: {user.city}</p>}
    </div>
  );
};

export default Account;



