import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const [consent, setConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [otherDocs, setOtherDocs] = useState<FileList | null>(null);

  const licenseInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!consent) {
      alert("You must agree to the data processing terms.");
      return;
    }
    if (!licenseFile) {
      alert("Please upload your business license.");
      return;
    }

    console.log("Registering:", {
      ...form,
      consent,
      marketingOptIn,
      licenseFileName: licenseFile.name,
      otherDocsCount: otherDocs?.length ?? 0,
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left: Form Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 md:p-10 z-10 relative">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img
              src="/WHW.jpg"
              alt="Wanaw Logo"
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1c2b21]">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              required
              value={form.businessName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <input
              type="text"
              disabled
              value="Ethiopia"
              className="w-full p-2 border rounded text-sm border-gray-300 cursor-not-allowed"
            />

            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (optional)"
              value={form.referralCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />

            {/* Upload License */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Upload Business License <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
                ref={licenseInputRef}
                className="w-full text-sm border border-gray-300 rounded p-2 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-[#D4AF37] file:text-[#1c2b21]"
              />
              {licenseFile && (
                <p className="text-xs mt-1 text-green-700">
                  ✔️ {licenseFile.name}
                </p>
              )}
            </div>

            {/* Upload Additional Docs */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Additional Documents (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => setOtherDocs(e.target.files)}
                className="w-full text-sm border border-gray-300 rounded p-2 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100"
              />
              {otherDocs && (
                <p className="text-xs mt-1 text-blue-600">
                  {Array.from(otherDocs)
                    .map((f) => f.name)
                    .join(", ")}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label className="leading-snug">
                I consent to the collection and processing of my personal data
                in line with data regulations as described in the{" "}
                <a href="#" className="text-blue-600 underline">
                  Privacy Policy
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-600 underline">
                  Merchant Service Agreement
                </a>
                .
              </label>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
              />
              <label>
                I would like to receive marketing emails about promotions, new
                features, and events from Wanaw.
              </label>
            </div>

            <p className="text-xs text-gray-600 text-center">
              By clicking the{" "}
              <span className="font-semibold text-[#1c2b21]">
                "Create my account"
              </span>{" "}
              button, you agree to Wanaw's terms of acceptable use.
            </p>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 rounded-full hover:rounded-md transition"
            >
              Create My Account
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1c2b21] text-lg hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-12">
            Ⓒ All rights reserved by Wanaw
          </p>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-4"
        >
          <path d="M0,0 C50,50 50,50 100,100 L100,0 Z" fill="#fafafa" />
        </svg>
      </div>

      {/* Right: Info */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center bg-green relative overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="text-left px-6 sm:px-10 max-w-md mx-auto mt-40 relative z-10">
          <div className="space-y-6 border-l-4 border-[#D4AF37] pl-6 relative">
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                Wellness Booking
              </span>
              <p className="text-white">
                Book{" "}
                <strong className="text-yellow-200">holistic wellness</strong> &
                spa sessions effortlessly.
              </p>
            </div>
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                Gift Services
              </span>
              <p className="text-white">
                Send <strong className="text-yellow-200">curated gifts</strong>{" "}
                for corporate & personal occasions.
              </p>
            </div>
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                Business Gifting
              </span>
              <p className="text-white">
                Tailor{" "}
                <strong className="text-yellow-200">business gifting</strong>{" "}
                for teams, clients, and events.
              </p>
            </div>
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                Event Reminders
              </span>
              <p className="text-white">
                Never miss a special moment—let Wanaw{" "}
                <strong className="text-yellow-200">remind and deliver</strong>.
              </p>
            </div>
          </div>
          <div className="mt-10 border-t pt-5 border-yellow-200">
            <p className="text-white font-semibold text-base text-center">
              Your journey to wellness and meaningful giving starts here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
