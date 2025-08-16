import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="bg-[#1c2b21] text-white p-4 flex justify-between items-center relative">
      {/* Logo */}
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Wanaw
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-semibold text-[#1c2b21] cursor-default">
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
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#D4AF37] text-[#1c2b21] px-4 py-2 rounded hover:bg-yellow-400"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          className="text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-56 bg-[#1c2b21] shadow-lg rounded-md mt-2 p-4 flex flex-col gap-3 z-50 md:hidden">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-semibold text-[#1c2b21]">
                  {getInitials(user.fullName || "U")}
                </div>
                <span>{user.fullName}</span>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="bg-[#D4AF37] text-[#1c2b21] rounded-md px-3 py-2 underline hover:rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#D4AF37] text-[#1c2b21] px-4 py-2 rounded hover:bg-yellow-400"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

