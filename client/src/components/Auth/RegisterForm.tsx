// (1) IMPORTS & STATE
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../api/api";

const RegisterForm = () => {
  const [role, setRole] = useState<"individual" | "provider" | "corporate" | "diaspora">("individual");

  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    password: "",
    confirmPassword: "",
    idFile: null as File | null,
  });

  const [providerForm, setProviderForm] = useState({
  companyName: "",
  serviceType: "",
  email: "",
  phone: "",
   alternativePhone: "",// ✅ new
  officePhone: "",   
  whatsapp: "",
  telegram: "",
  city: "",
  location: "",
  tin: "",
  branches: [{ city: "", location: "" }],
  banks: [{ bankName: "", accountNumber: "" }],
  password: "",
  confirmPassword: "",
  license: null as File | null,
  tradeRegistration: null as File | null,
  servicePhotos: [] as File[],
  video: null as File | null,
  priceList: null as File | null,
});

  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  // (2) HANDLERS
  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as typeof role);
  };

const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value, files } = e.target;

  if (files) {
    const file = files[0];
    if (file && file.size > 200 * 1024 * 1024) {
      alert("File size exceeds the 200MB limit.");
      return;
    }
    setUserForm({ ...userForm, [name]: file });
  } else {
    setUserForm({ ...userForm, [name]: value });
  }
};


// Update single-value fields
const handleProviderChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, files } = e.target as HTMLInputElement;
  // ... existing file logic ...

  if (!files) {
    setProviderForm({ ...providerForm, [name]: value });
  }
};

// Handle branches change

const addBranch = () => {
  setProviderForm({
    ...providerForm,
    branches: [...providerForm.branches, { city: "", location: "" }],
  });
};

const removeBranch = (index: number) => {
  const newBranches = providerForm.branches.filter((_, i) => i !== index);
  setProviderForm({ ...providerForm, branches: newBranches });
};

// Handle banks change
const handleBankChange = (
  index: number,
  field: "bankName" | "accountNumber",
  value: string
) => {
  const newBanks = [...providerForm.banks];
  newBanks[index][field] = value;
  setProviderForm({ ...providerForm, banks: newBanks });
};


const addBank = () => {
  setProviderForm({
    ...providerForm,
    banks: [...providerForm.banks, { bankName: "", accountNumber: "" }],
  });
};

const removeBank = (index: number) => {
  const newBanks = providerForm.banks.filter((_, i) => i !== index);
  setProviderForm({ ...providerForm, banks: newBanks });
};

//membership
const [membership, setMembership] = useState<string>(
  role === "provider" ? "Basic Provider" : "Standard Member"
);
const handleMembershipChange = (e: ChangeEvent<HTMLSelectElement>) => {
  setMembership(e.target.value);
};



  // (3) SUBMIT
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!consent) {
      alert("You must agree to the data processing terms.");
      return;
    }

    if (role === "individual" || role === "diaspora") {
      if (userForm.password !== userForm.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (userForm.idFile) {
        const fd = new FormData();
        fd.append("fullName", `${userForm.firstName} ${userForm.lastName}`.trim());
        fd.append("email", userForm.email);
        fd.append("phone", userForm.phone);
        fd.append("password", userForm.password);
        fd.append("role", role);
        fd.append("whatsapp", userForm.whatsapp);
        fd.append("telegram", userForm.telegram);
        fd.append("id", userForm.idFile); 
        

        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          body: fd,
        });

        if (!res.ok) {
          const { msg } = await res.json().catch(() => ({}));
          alert(msg || "Registration failed");
          return;
        }

        alert("Account created successfully!");
        navigate("/login");
      } else {
        const payload = {
          fullName: `${userForm.firstName} ${userForm.lastName}`.trim(),
          email: userForm.email,
          phone: userForm.phone,
          password: userForm.password,
          role,
          whatsapp: userForm.whatsapp,
          telegram: userForm.telegram,
        };

        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const { msg } = await res.json().catch(() => ({}));
          alert(msg || "Registration failed");
          return;
        }

        alert("Account created successfully!");
        navigate("/login");
      }
      return;
    }

    // PROVIDER / CORPORATE
    if (!providerForm.companyName || !providerForm.serviceType) {
      alert("Company name and service type are required.");
      return;
    }

    const fd = new FormData();
    fd.append("fullName", providerForm.companyName.trim());
    fd.append("companyName", providerForm.companyName);
    fd.append("serviceType", providerForm.serviceType);
    fd.append("role", role);
    fd.append("email", providerForm.email);
    fd.append("phone", providerForm.phone);
    fd.append("whatsapp", providerForm.whatsapp);
    fd.append("telegram", providerForm.telegram);
    fd.append("city", providerForm.city);
    fd.append("location", providerForm.location);
    fd.append("password", providerForm.password);
    if (providerForm.license) fd.append("license", providerForm.license);
    if (providerForm.tradeRegistration) fd.append("tradeRegistration", providerForm.tradeRegistration);
    providerForm.servicePhotos.forEach(file => fd.append("servicePhotos", file));
    if (providerForm.video) fd.append("video", providerForm.video);
    if (providerForm.priceList) {
  fd.append("priceList", providerForm.priceList);
  fd.append("tin", providerForm.tin);
fd.append("branches", JSON.stringify(providerForm.branches));
fd.append("banks", JSON.stringify(providerForm.banks));

}


    const resProv = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      body: fd,
    });

    if (!resProv.ok) {
      const { msg } = await resProv.json().catch(() => ({}));
      alert(msg || "Provider registration failed");
      return;
    }

    alert("Account created successfully!");
    navigate("/login");
  };

 



  /* ──────────────────── 4️⃣ RENDER ──────────────────── */
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
            {role === "individual" ? "Create Your Account" : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)} Provider`}
          </h2>

          {/* Role selector */}
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
              <option value="individual">Individual User</option>
              <option value="provider">Service Provider</option>
              <option value="corporate">Corporate</option>
              <option value="diaspora">Ethiopian Diaspora</option>
            </select>
          </div>
{/* Membership Options */}
<div className="mb-4">
  <label htmlFor="membership" className="block text-sm font-medium text-gray-700 mb-1">
    Membership Level
  </label>

  { (role === "individual" || role === "diaspora" || role === "corporate") && (
    <select
      id="membership"
      name="membership"
      value={membership}
      onChange={handleMembershipChange}
      className="w-full p-2 border border-gray-300 rounded text-sm"
    >
      <option value="Standard Member">Standard Member</option>
      <option value="Gold Member" disabled>Gold Member (Coming Soon)</option>
      <option value="Platinum Member" disabled>Platinum Member (Coming Soon)</option>
    </select>
  )}

  {role === "provider" && (
    <select
      id="membership"
      name="membership"
      value={membership}
      onChange={handleMembershipChange}
      className="w-full p-2 border border-gray-300 rounded text-sm"
    >
      <option value="Basic Provider">Basic Provider</option>
      <option value="Premium Provider" disabled>Premium Provider (Coming Soon)</option>
    </select>
  )}
</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* INDIVIDUAL FORM FIELDS */}
            {(role === "individual"|| role === "diaspora") && (
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
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  required
                  value={userForm.phone || ""}
                  onChange={handleUserChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                {(role === "diaspora" || role === "individual") && (
  <>
    <input
      type="tel"
      name="whatsapp"
      placeholder="WhatsApp"
      required
      value={userForm.whatsapp}
      onChange={handleUserChange}
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
    <input
      type="text"
      name="telegram"
      placeholder="Telegram"
      required
      value={userForm.telegram}
      onChange={handleUserChange}
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
  </>
)}

{role === "diaspora" && (
  <>
    <label className="block text-sm font-medium text-gray-700 mt-2">
      Yellow Card/Passport (PDF/Image)
    </label>
    <input
 type="file" name="id" 
      accept="application/pdf,image/*"
      required
      onChange={handleUserChange}
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
  </>
)}

{role === "individual" && (
  <>
    <label className="block text-sm font-medium text-gray-700 mt-2">
      Government ID/Driving licence(PDF/Image)
    </label>
    <input
 type="file" name="id" 
      accept="application/pdf,image/*"
      required
      onChange={handleUserChange}
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
  </>
)}

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

            {/* PROVIDER / CORPORATE / DIASPORA FORM FIELDS */}
            {(role === "provider" || role === "corporate" ) && (
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
                  <option value="Wellness Services">Wellness Services</option>
                  <option value="Medical">Medical Services</option>
                  <option value="Home Based/Mobile services">Home Based/Mobile services</option>
                  <option value="Hotel Rooms">Hotel Rooms</option>
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
  name="alternativePhone"
  placeholder="Alternative Mobile Phone"
  value={providerForm.alternativePhone}
  onChange={handleProviderChange}
  className="w-full p-2 border border-gray-300 rounded text-sm"
/>

<input
  type="tel"
  name="officePhone"
  placeholder="Office Phone"
  value={providerForm.officePhone}
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
                {/* Password */}
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
                {/* Files */}
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
                <label className="block text-sm font-medium text-gray-700 mt-2">Intro Video (optional)</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                {/* TIN */}
<input
  type="text"
  name="tin"
  placeholder="Tax Identification Number (TIN)"
  required
  value={providerForm.tin}
  onChange={handleProviderChange}
  className="w-full p-2 border border-gray-300 rounded text-sm"
/>

{/* Branches */}
<div className="mt-4">
  <label className="block font-medium">Branches</label>
  {providerForm.branches.map((_branch, idx) => (
    <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
    <input
  type="text"
  name="city"
  placeholder="Headquarter / Primary Location"
  required
  value={providerForm.city}
  onChange={handleProviderChange}
  className="w-full p-2 border border-gray-300 rounded text-sm"
/>

 

      {providerForm.branches.length > 1 && (
        <button type="button" onClick={() => removeBranch(idx)} className="text-red-500">Remove</button>
      )}
    </div>
  ))}
  <button type="button" onClick={addBranch} className="text-blue-500 mt-1">+ Add Branch</button>
</div>

{/* Banks */}
<div className="mt-4">
  <label className="block font-medium">Bank Accounts</label>
  {providerForm.banks.map((bank, idx) => (
    <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
<select
  value={bank.bankName}
  onChange={(e) => handleBankChange(idx, "bankName", e.target.value)}
  className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
>
  <option value="">Select Bank</option>
  <option value="Abay Bank">Abay Bank</option>
  <option value="Addis International Bank">Addis International Bank</option>
  <option value="Ahadu Bank">Ahadu Bank</option>
  <option value="Amhara Bank">Amhara Bank</option>
  <option value="Anbesa International Bank">Anbesa International Bank</option>
  <option value="Bank of Abyssinia">Bank of Abyssinia</option>
  <option value="Berhan Bank">Berhan Bank</option>
  <option value="Buna Bank">Buna Bank</option>
  <option value="Buna Cooperative Bank of Oromia">Buna Cooperative Bank of Oromia</option>
  <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia</option>
  <option value="Dashen Bank">Dashen Bank</option>
  <option value="Debub Global Bank">Debub Global Bank</option>
  <option value="Dire Microfinance Institution">Dire Microfinance Institution</option>
  <option value="Enat Bank">Enat Bank</option>
  <option value="Goh Betoch Bank">Goh Betoch Bank</option>
  <option value="Hibret Bank">Hibret Bank</option>
  <option value="Nib Bank">Nib International Bank</option>
  <option value="Shebelle Bank">Shebelle Bank</option>
  <option value="Siket Bank">Siket Bank</option>
  <option value="Sidamo Bank">Sidamo Bank</option>
  <option value="Wegagen Bank">Wegagen Bank</option>
  <option value="ZamZam Bank">ZamZam Bank</option>
  <option value="Zemen Bank">Zemen Bank</option>
</select>



      <input
        type="text"
        placeholder="Account Number"
        value={bank.accountNumber}
        onChange={(e) => handleBankChange(idx, "accountNumber", e.target.value)}
        className="w-full sm:w-1/2 p-2 border border-gray-300 rounded text-sm"
      />
      {providerForm.banks.length > 1 && (
        <button type="button" onClick={() => removeBank(idx)} className="text-red-500">Remove</button>
      )}
    </div>
  ))}
  <button type="button" onClick={addBank} className="text-blue-500 mt-1">+ Add Bank Account</button>
</div>

                
  <label htmlFor="priceList" className="block text-sm font-medium text-gray-700 mb-1">
    Price List / Quotation Document (PDF)
  </label>
  <input
    type="file"
    id="priceList"
    name="priceList"
    accept=".pdf"
    onChange={handleProviderChange}
    className="w-full p-2 border border-gray-300 rounded text-sm"
  />


              </>
            )}

            {/* Country (static) */}
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
                I consent to the collection and processing of my personal data in line with data regulations as described in the <a href="#" className="text-blue-600 underline">Privacy Policy</a> & <a href="#" className="text-blue-600 underline">Merchant Service Agreement</a>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 rounded-full hover:rounded-md transition"
            >
              {role === "individual" ? "Create My Account" : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)} `}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1c2b21] text-lg hover:underline">
              Login
            </Link>
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

