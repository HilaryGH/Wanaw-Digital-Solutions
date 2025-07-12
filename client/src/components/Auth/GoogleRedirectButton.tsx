// components/GoogleRedirectButton.tsx
import BASE_URL from "../../api/api";

const GoogleRedirectButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL.replace("/api", "")}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full mt-1 p-2 bg-green text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleRedirectButton;

