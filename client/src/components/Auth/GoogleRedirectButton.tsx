const GoogleRedirectButton = () => {
  const handleGoogleLogin = () => {
    const isDev = import.meta.env.DEV;

    const BASE_URL = isDev
      ? "http://localhost:5000"
      : "https://wanaw-digital-solutions.onrender.com";

    window.location.href = `${BASE_URL}/api/auth/google`;
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





