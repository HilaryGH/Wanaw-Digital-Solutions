// components/GoogleRedirectButton.tsx
import BASE_URL from "../../api/api";

const GoogleRedirectButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL.replace("/api", "")}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleRedirectButton;

