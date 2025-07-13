import { useState } from "react";
import type {ChangeEvent, FormEvent} from "react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";


const RegisterForm = () => {
  /** ----------------------------------
   * 1️⃣  STATE
   * ----------------------------------*/
  const [role, setRole] = useState<"user" | "provider">("user");

  // ── Individual user form fields
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ── Service‑provider form fields (+ file objects)
  const [providerForm, setProviderForm] = useState({
    companyName: "",
    serviceType: "", // dropdown
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    city: "",
    location: "",
    password: "", // still needed for dashboard login
    confirmPassword: "",
    license: null as File | null,
    tradeRegistration: null as File | null,
    servicePhotos: [] as File[],
    video: null as File | null, // optional
  });

  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  /** ----------------------------------
   * 2️⃣  HANDLERS
   * ----------------------------------*/
  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as "user" | "provider");
  };

  const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleProviderChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      if (name === "servicePhotos") {
        setProviderForm({ ...providerForm, servicePhotos: Array.from(files) });
      } else {
        setProviderForm({ ...providerForm, [name]: files[0] });
      }
    } else {
      setProviderForm({ ...providerForm, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!consent) {
      alert("You must agree to the data processing terms.");
      return;
    }

    try {
      /****************************
       * USER REGISTRATION
       ***************************/
      if (role === "user") {
        if (userForm.password !== userForm.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const payload = {
          fullName: `${userForm.firstName} ${userForm.lastName}`.trim(),
          email: userForm.email,
          password: userForm.password,
        };

        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Registration failed");
        await res.json();
        alert("Account created successfully!");
        navigate("/login");
      }

      /****************************
       * SERVICE‑PROVIDER REGISTRATION
       ***************************/
      if (role === "provider") {
        if (providerForm.password !== providerForm.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const fd = new FormData();
        fd.append("companyName", providerForm.companyName);
        fd.append("serviceType", providerForm.serviceType);
        fd.append("email", providerForm.email);
        fd.append("phone", providerForm.phone);
        fd.append("whatsapp", providerForm.whatsapp);
        fd.append("telegram", providerForm.telegram);
        fd.append("city", providerForm.city);
        fd.append("location", providerForm.location);
        fd.append("password", providerForm.password);

        if (providerForm.license) fd.append("license", providerForm.license);
        if (providerForm.tradeRegistration)
          fd.append("tradeRegistration", providerForm.tradeRegistration);
        providerForm.servicePhotos.forEach((file) =>
          fd.append("servicePhotos", file)
        );
        if (providerForm.video) fd.append("video", providerForm.video);

        const res = await fetch(`${BASE_URL}/service-providers/register`, {
          method: "POST",
          body: fd,
        });

        if (!res.ok) throw new Error("Provider registration failed");
        await res.json();
        alert("Service‑provider account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while registering. Please try again.");
    }
  };

  /** ----------------------------------
   * 3️⃣  RENDER
   * ----------------------------------*/
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left: Form Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 md:p-10 z-10 relative">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/WHW.jpg" alt="Wanaw Logo" className="h-16 w-16 rounded-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1c2b21]">
            {role === "user" ? "Create Your Account" : "Register as Service Provider"}
          </h2>

          {/* ⚡️ Role selector */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Registering as
            </label>
            <select
              id="role"
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="user">Individual User</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {role === "user" && (
              <>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={userForm.firstName}
                    onChange={handleUserChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={userForm.lastName}
                    onChange={handleUserChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={userForm.email}
                  onChange={handleUserChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={userForm.password}
                    onChange={handleUserChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={userForm.confirmPassword}
                    onChange={handleUserChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </>
            )}

            {role === "provider" && (
              <>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  required
                  value={providerForm.companyName}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <select
                  name="serviceType"
                  required
                  value={providerForm.serviceType}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="" disabled>
                    Select Service Type
                  </option>
                  <option value="Spa">Spa</option>
                  <option value="Gym">Gym</option>
                  <option value="Wellness Center">Wellness Center</option>
                  <option value="Health Coach">Health Coach</option>
                  <option value="Nutritionist">Nutritionist</option>
                  {/* TODO: pull list dynamically from backend */}
                </select>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={providerForm.email}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  required
                  value={providerForm.phone}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="WhatsApp"
                  required
                  value={providerForm.whatsapp}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <input
                  type="text"
                  name="telegram"
                  placeholder="Telegram"
                  required
                  value={providerForm.telegram}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    value={providerForm.city}
                    onChange={handleProviderChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Exact Location / Address"
                    required
                    value={providerForm.location}
                    onChange={handleProviderChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                {/* Password fields (dashboard access) */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={providerForm.password}
                    onChange={handleProviderChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={providerForm.confirmPassword}
                    onChange={handleProviderChange}
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                {/* File uploads */}
                <label className="block text-sm font-medium text-gray-700 mt-2">License (PDF/Image)</label>
                <input
                  type="file"
                  name="license"
                  accept="application/pdf,image/*"
                  required
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <label className="block text-sm font-medium text-gray-700 mt-2">Trade Registration (PDF/Image)</label>
                <input
                  type="file"
                  name="tradeRegistration"
                  accept="application/pdf,image/*"
                  required
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <label className="block text-sm font-medium text-gray-700 mt-2">Service Centre Photos (up to 5)</label>
                <input
                  type="file"
                  name="servicePhotos"
                  accept="image/*"
                  multiple
                  required
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />

                <label className="block text-sm font-medium text-gray-700 mt-2">Intro Video (optional, ≤30 min)</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </>
            )}

            {/* Country – unchanged */}
            <input
              type="text"
              disabled
              value="Ethiopia"
              className="w-full p-2 border rounded text-sm border-gray-300 cursor-not-allowed"
            />

            {/* Consent */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label className="leading-snug">
                I consent to the collection and processing of my personal data in
                line with data regulations as described in the <a href="#" className="text-blue-600 underline">Privacy Policy</a> & <a href="#" className="text-blue-600 underline">Merchant Service Agreement</a>.
              </label>
            </div>

            {/* Legal note */}
            <p className="text-xs text-gray-600 text-center">
              By clicking the <span className="font-semibold text-[#1c2b21]">"Create my account"</span> button, you agree to Wanaw's terms of acceptable use.
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 rounded-full hover:rounded-md transition"
            >
              {role === "user" ? "Create My Account" : "Register Service Provider"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/login" className="text-[#1c2b21] text-lg hover:underline">Login</Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-12">Ⓒ All rights reserved by Wanaw</p>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-4">
          <path d="M0,0 C50,50 50,50 100,100 L100,0 Z" fill="#fafafa" />
        </svg>
      </div>

      {/* Right: Info Section (unchanged) */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center bg-green relative overflow-hidden z-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}></div>
        <div className="text-left px-6 sm:px-10 max-w-md mx-auto mt-40 relative z-10">
          <div className="space-y-6 border-l-4 border-[#D4AF37] pl-6 relative">
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">Wellness Booking</span>
              <p className="text-white">Book <strong className="text-yellow-200">holistic wellness</strong> & spa sessions effortlessly.</p>
            </div>
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">Gift Services</span>
              <p className="text-white">Send <strong className="text-yellow-200">curated gifts</strong> for corporate & personal occasions.</p>
            </div>
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">Business Gifting</span>
              <p className="text-white">Tailor <strong className="text-yellow-200">business gifting</strong> for teams, clients, and events.</p>
            </div>
            <div className="relative">
              <span className="inline-block bg-[#D4AF37] text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-1">Event Reminders</span>
              <p className="text-white">Never miss a special moment—let Wanaw <strong className="text-yellow-200">remind and deliver</strong>.</p>
            </div>
          </div>
          <div className="mt-10 border-t pt-5 border-yellow-200">
            <p className="text-white font-semibold text-base text-center">Your journey to wellness and meaningful giving starts here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
