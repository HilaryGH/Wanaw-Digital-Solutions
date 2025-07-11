import { GoogleLogin } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during Google login.");
    }
  };

  return (
    <div className="mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google Sign In Failed")}
      />
    </div>
  );
};

export default GoogleLoginButton;
