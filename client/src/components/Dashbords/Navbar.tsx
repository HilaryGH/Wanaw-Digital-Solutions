import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="flex justify-between items-center p-4 bg-[#1c2b21] text-white">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Wanaw
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center text-[#1c2b21] justify-center font-semibold cursor-default">
            {getInitials(user.fullName || "U")}
          </div>
          <span>{user.fullName}</span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-[#D4AF37] text-[#1c2b21] rounded-md px-3 py-2 underline hover:rounded-full"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-[#D4AF37] text-[#1c2b21] px-4 py-2 rounded hover:bg-yellow-400"
        >
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
