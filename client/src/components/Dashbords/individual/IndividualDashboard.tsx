import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IndividualDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return navigate("/login");

      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "individual") return navigate("/login");

      setUser(parsedUser);
    };

    checkUser();
  }, [navigate]);

  return (
    <div>
      {/* Your dashboard UI here */}
      <p>user</p>
    </div>
  );
};

export default IndividualDashboard;


