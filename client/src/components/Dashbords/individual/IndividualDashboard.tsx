import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  fullName: string;
  role: string;
  // add any other fields if needed
};

const IndividualDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null); // ✅ FIXED here

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return navigate("/login");

      const parsedUser: User = JSON.parse(storedUser);
      if (parsedUser.role !== "individual") return navigate("/login");

      setUser(parsedUser);
    };

    checkUser();
  }, [navigate]);

  return (
    <div>
      {user ? (
        <p>Welcome, {user.fullName || "Individual"}!</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default IndividualDashboard;



