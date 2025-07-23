import { useLocation } from "react-router-dom";
import { useState } from "react";

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
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Reset Password</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default ResetPassword;

