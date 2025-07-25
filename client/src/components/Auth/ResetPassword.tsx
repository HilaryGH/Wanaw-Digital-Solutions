import { useLocation } from "react-router-dom";
import { useState } from "react";
import BASE_URL from "../../api/api";

const ResetPassword = () => {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Extract token from query string
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Something went wrong.");
        return;
      }

      setMessage(data.msg); // ✅ fixed key
      setPassword(""); // optional
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        {/* Optional hidden username for accessibility */}
        <input type="text" name="username" autoComplete="username" style={{ display: "none" }} />
        
        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Enter new password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default ResetPassword;
