import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import { generateCertificate } from "../assets/generateCertificate";


const SupportCommunityForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    region: "",
    userType: "individual",

    roles: {
      gifter: false,
      influencer: false,
      brandAmbassador: false,
      serviceProvider: false,
      volunteer: false,
    },

    gifterTier: "individual",
    influencerTier: "",
    influencerRoles: [] as string[],
    brandAmbassadorTier: "",
    brandAmbassadorRoles: [] as string[],
    serviceProviderTier: "",
    volunteerTier: "",

    message: "",
  });

  const handleRoleToggle = (role: keyof typeof formData.roles) => {
    setFormData((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: !prev.roles[role] },
      ...(prev.roles[role]
        ? {
            ...(role === "gifter" && { gifterTier: "individual" }),
            ...(role === "influencer" && { influencerTier: "", influencerRoles: [] }),
            ...(role === "brandAmbassador" && { brandAmbassadorTier: "", brandAmbassadorRoles: [] }),
            ...(role === "serviceProvider" && { serviceProviderTier: "" }),
            ...(role === "volunteer" && { volunteerTier: "" }),
          }
        : {}),
    }));
  };

  const handleTierChange = (
    roleTierKey:
      | "gifterTier"
      | "influencerTier"
      | "brandAmbassadorTier"
      | "serviceProviderTier"
      | "volunteerTier",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [roleTierKey]: value,
    }));
  };

  const handleMultiRoleChange = (
    roleKey: "influencerRoles" | "brandAmbassadorRoles",
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const current = prev[roleKey];
      const updated = checked ? [...current, value] : current.filter((v) => v !== value);
      return { ...prev, [roleKey]: updated };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill your name and email.");
      return;
    }

    if (!Object.values(formData.roles).some(Boolean)) {
      alert("Please select at least one role.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Convert roles to array strings matching backend
      const rolesArray: string[] = [];
      if (formData.roles.gifter) rolesArray.push("Gifter");
      if (formData.roles.influencer) rolesArray.push("Influencer");
      if (formData.roles.brandAmbassador) rolesArray.push("Brand Ambassador");
      if (formData.roles.serviceProvider) rolesArray.push("Service Provider");
      if (formData.roles.volunteer) rolesArray.push("Volunteer");

      // Map tier values to backend enum format
      const serviceProviderTierMap: Record<string, string> = {
        primaryHealthcareProvider: "Primary Healthcare Provider",
        specializedServiceProvider: "Specialized Service Provider",
      };

      const volunteerTierMap: Record<string, string> = {
        coreVolunteer: "coreVolunteer",
        projectBasedVolunteer: "projectBasedVolunteer",
        occasionalVolunteer: "occasionalVolunteer",
        virtualVolunteer: "virtualVolunteer",
        studentVolunteer: "studentVolunteer",
      };

      const payload = {
        ...formData,
        roles: rolesArray,
        serviceProviderTier: serviceProviderTierMap[formData.serviceProviderTier] || "",
        volunteerTier: volunteerTierMap[formData.volunteerTier] || "",
      };

      const res = await fetch(`${BASE_URL}/support-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      // Save userRoles in localStorage
      localStorage.setItem("userRoles", JSON.stringify(formData.roles));
  generateCertificate({
  name: formData.name,
  role: rolesArray[0] || "Member", // pick first or main role
  tier:
    formData.gifterTier ||
    formData.influencerTier ||
    formData.brandAmbassadorTier ||
    formData.serviceProviderTier ||
    formData.volunteerTier,
});


      alert("Thank you for joining the Support Community!");
      navigate("/community/hemodialysis");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#1c2b21] rounded-full opacity-40 animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#1c2b21] rounded-full opacity-30 animate-spin-slow z-0"></div>
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#1c2b21] rounded-full opacity-40 animate-pulse z-0"></div>
      <div className="absolute -top-10 right-10 w-32 h-32 bg-[#D4AF37] rotate-45 rounded-lg opacity-50 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-3xl bg-white shadow-2xl rounded-xl p-8 space-y-6 relative"
      >
        <div className="absolute -top-5 left-5 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-md">
          Join Support Community
        </div>

        <h2 className="text-3xl font-bold text-center text-[#1c2b21]">Wanaw Lewegenachen Hiwot</h2>
        <p className="text-center font-bold text-gold mb-4 text-lg">“ዋናው ለወገናችን ሂወት”</p>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="p-2 border rounded border-gray-300" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="p-2 border rounded border-gray-300" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="p-2 border rounded border-gray-300" />
          <input name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} className="p-2 border rounded border-gray-300" />
          <input name="telegram" placeholder="Telegram" value={formData.telegram} onChange={handleChange} className="p-2 border rounded border-gray-300" />
          <input name="region" placeholder="City / Region" value={formData.region} onChange={handleChange} className="p-2 border rounded border-gray-300" />
        </div>

        {/* Gifters */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input type="checkbox" checked={formData.roles.gifter} onChange={() => handleRoleToggle("gifter")} />
            A. Gifters — Send Gift for preferable Hemodialysis Patients Treatments
          </label>
          {formData.roles.gifter && (
            <select value={formData.gifterTier} onChange={(e) => handleTierChange("gifterTier", e.target.value)} className="ml-2 p-2 border rounded border-gray-300">
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
            </select>
          )}
        </div>

        {/* Influencers */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input type="checkbox" checked={formData.roles.influencer} onChange={() => handleRoleToggle("influencer")} />
            B. Influencers — Promote your preferable Hemodialysis Patient
          </label>
          {formData.roles.influencer && (
            <>
              <select value={formData.influencerTier} onChange={(e) => handleTierChange("influencerTier", e.target.value)} className="ml-2 p-2 border rounded border-gray-300">
                <option value="">Select</option>
                <option value="Mega Influencer">Mega Influencers (Over 1 Million Followers)</option>
                <option value="Macro Influencer">Macro Influencers (100,000 to 1 Million Followers)</option>
                <option value="Micro Influencer">Micro Influencers (1,000 to 100,000 Followers)</option>
                <option value="Nano Influencer">Nano Influencers (Less than 1,000 Followers)</option>
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                {["Tiktok live", "YouTube live", "Post/Share Content","Instagram live"].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.influencerRoles.includes(item)} onChange={(e) => handleMultiRoleChange("influencerRoles", item, e.target.checked)} />
                    {item}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Brand Ambassadors */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input type="checkbox" checked={formData.roles.brandAmbassador} onChange={() => handleRoleToggle("brandAmbassador")} />
            C. Brand Ambassadors — Promote Wanaw Support Community Program
          </label>
          {formData.roles.brandAmbassador && (
            <>
              <select value={formData.brandAmbassadorTier} onChange={(e) => handleTierChange("brandAmbassadorTier", e.target.value)} className="ml-2 p-2 border rounded border-gray-300">
                <option value="">Select</option>
                <option value="Celebrity Ambassador">Celebrity Ambassador</option>
                <option value="Community Advocate">Community Advocate</option>
                <option value="Industry Expert">Industry Expert</option>
                <option value="Customer Ambassador">Customer Ambassador</option>
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                {["Tiktok", "LinkedIn", "Instagram", "Facebook", "Personal Networks"].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.brandAmbassadorRoles.includes(item)} onChange={(e) => handleMultiRoleChange("brandAmbassadorRoles", item, e.target.checked)} />
                    {item}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Service Providers */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input type="checkbox" checked={formData.roles.serviceProvider} onChange={() => handleRoleToggle("serviceProvider")} />
            D. Service Providers — Provide Health Service
          </label>
          {formData.roles.serviceProvider && (
            <select value={formData.serviceProviderTier} onChange={(e) => handleTierChange("serviceProviderTier", e.target.value)} className="ml-2 p-2 border rounded border-gray-300">
              <option value="">Select Tier</option>
              <option value="primaryHealthcareProvider">Primary Healthcare Provider</option>
              <option value="specializedServiceProvider">Specialized Service Provider</option>
            </select>
          )}
        </div>

        {/* Volunteers */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input type="checkbox" checked={formData.roles.volunteer} onChange={() => handleRoleToggle("volunteer")} />
            E. Volunteers — Support Community Program
          </label>
          {formData.roles.volunteer && (
            <select value={formData.volunteerTier} onChange={(e) => handleTierChange("volunteerTier", e.target.value)} className="ml-2 p-2 border rounded border-gray-300">
              <option value="">Select Tier</option>
              <option value="coreVolunteer">Core Volunteer</option>
              <option value="projectBasedVolunteer">Project Based Volunteer</option>
              <option value="occasionalVolunteer">Occasional Volunteer</option>
              <option value="virtualVolunteer">Virtual Volunteer</option>
              <option value="studentVolunteer">Student Volunteer</option>
            </select>
          )}
        </div>

        {/* Message */}
        <div>
          <textarea
            name="message"
            placeholder="Message (optional)"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded border-gray-300"
          ></textarea>
        </div>

        <button type="submit" className="w-full py-2 bg-[#1c2b21] text-white font-bold rounded hover:bg-[#0f1a14]">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupportCommunityForm;



