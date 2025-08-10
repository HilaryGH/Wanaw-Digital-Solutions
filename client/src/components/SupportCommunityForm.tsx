import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const SupportCommunityForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    region: "",
    userType: "individual", // For Gifters (Individual/Corporate)

    roles: {
      gifter: false,
      influencer: false,
      brandAmbassador: false,
      serviceProvider: false,
      volunteer: false,
    },

    // Tier selections
    gifterTier: "individual", // same as userType, keep synced below
    influencerTier: "",
    influencerRoles: [] as string[],
    brandAmbassadorTier: "",
    brandAmbassadorRoles: [] as string[],
    serviceProviderTier: "",
    volunteerTier: "",

    message: "",
  });

 

  // Handle main role checkboxes
  const handleRoleToggle = (role: keyof typeof formData.roles) => {
    setFormData((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: !prev.roles[role] },
      // Reset tiers/roles for that role when unchecking:
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

  // Handle tier changes for roles
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

  // Handle multi-select role checkboxes (for Influencer and Brand Ambassador)
  const handleMultiRoleChange = (
    roleKey: "influencerRoles" | "brandAmbassadorRoles",
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const current = prev[roleKey];
      let updated: string[];
      if (checked) {
        updated = [...current, value];
      } else {
        updated = current.filter((v) => v !== value);
      }
      return { ...prev, [roleKey]: updated };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, } = e.target;

    // Ignore roles and tier changes here since we handle them separately
    if (
      name === "userType" ||
      name === "roles" ||
      name.endsWith("Tier") ||
      name === "influencerRoles" ||
      name === "brandAmbassadorRoles"
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation example
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
      const res = await fetch(`${BASE_URL}/support-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Submission failed");

      alert("Thank you for joining the Support Community!");
      navigate("/community/hemodialysis");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Brand Decorations */}
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

        <h2 className="text-3xl font-bold text-center text-[#1c2b21]">
          Wanaw Lewegenachen Hiwot
        </h2>
        <p className="text-center font-bold text-gold mb-4 text-lg">“ዋናው ለወገናችን ሂወት”</p>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <input
            name="whatsapp"
            placeholder="WhatsApp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <input
            name="telegram"
            placeholder="Telegram"
            value={formData.telegram}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
          <input
            name="region"
            placeholder="City / Region"
            value={formData.region}
            onChange={handleChange}
            className="p-2 border rounded border-gray-300"
          />
        </div>

        {/* Gifters */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input
              type="checkbox"
              checked={formData.roles.gifter}
              onChange={() => handleRoleToggle("gifter")}
            />
            A. Gifters — Send Gift for preferable Hemodialysis Patients Treatments
          </label>

          {formData.roles.gifter && (
            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-4">
              <label className="flex items-center gap-2">
                Tier:
                <select
                  value={formData.gifterTier}
                  onChange={(e) => handleTierChange("gifterTier", e.target.value)}
                  className="ml-2 p-2 border rounded border-gray-300"
                >
                  <option value="individual">Individual</option>
                  <option value="corporate">Corporate</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* Influencers */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input
              type="checkbox"
              checked={formData.roles.influencer}
              onChange={() => handleRoleToggle("influencer")}
            />
            B. Influencers — Promote their Preferable Hemodialysis Patient
          </label>

          {formData.roles.influencer && (
            <>
              <div className="mt-2">
                <label>
                  Influencer Tier:
                  <select
                    value={formData.influencerTier}
                    onChange={(e) => handleTierChange("influencerTier", e.target.value)}
                    className="ml-2 p-2 border rounded border-gray-300"
                  >
                    <option value="">Select Tier</option>
                    <option value="mega">
                      Mega Influencers (Over 1 Million Followers)
                    </option>
                    <option value="macro">
                      Macro Influencers (100,000 to 1 Million Followers)
                    </option>
                    <option value="micro">
                      Micro Influencers (1000 to 100,000 Followers)
                    </option>
                    <option value="nano">Nano Influencers (Less than 1000 Followers)</option>
                  </select>
                </label>
              </div>

              <div className="mt-3">
                <label className="font-medium">Role(s):</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  {[
                    "Tiktok live",
                    "YouTube live",
                    "Post/Share Content",
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.influencerRoles.includes(role)}
                        onChange={(e) =>
                          handleMultiRoleChange(
                            "influencerRoles",
                            role,
                            e.target.checked
                          )
                        }
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Brand Ambassadors */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input
              type="checkbox"
              checked={formData.roles.brandAmbassador}
              onChange={() => handleRoleToggle("brandAmbassador")}
            />
            C. Brand Ambassadors — Promote Wanaw Support Community Program
          </label>

          {formData.roles.brandAmbassador && (
            <>
              <div className="mt-2">
                <label>
                  Brand Ambassador Tier:
                  <select
                    value={formData.brandAmbassadorTier}
                    onChange={(e) =>
                      handleTierChange("brandAmbassadorTier", e.target.value)
                    }
                    className="ml-2 p-2 border rounded border-gray-300"
                  >
                    <option value="">Select Tier</option>
                    <option value="celebrity">Celebrity Ambassador</option>
                    <option value="communityAdvocate">Community Advocates</option>
                    <option value="industryExpert">Industry Expert</option>
                    <option value="customerAmbassador">Customer Ambassador</option>
                  </select>
                </label>
              </div>

              <div className="mt-3">
                <label className="font-medium">Role(s):</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  {[
                    "Tiktok",
                    "LinkedIn",
                    "Instagram",
                    "Facebook",
                    "Personal Networks",
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.brandAmbassadorRoles.includes(role)}
                        onChange={(e) =>
                          handleMultiRoleChange(
                            "brandAmbassadorRoles",
                            role,
                            e.target.checked
                          )
                        }
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Service Providers */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input
              type="checkbox"
              checked={formData.roles.serviceProvider}
              onChange={() => handleRoleToggle("serviceProvider")}
            />
            D. Service Providers — Give treatment Take Away for Hemodialysis Patients
          </label>

          {formData.roles.serviceProvider && (
            <div className="mt-2">
              <label>
                Service Provider Tier:
                <select
                  value={formData.serviceProviderTier}
                  onChange={(e) =>
                    handleTierChange("serviceProviderTier", e.target.value)
                  }
                  className="ml-2 p-2 border rounded border-gray-300"
                >
                  <option value="">Select Tier</option>
                  <option value="primaryHealthcareProvider">Primary Healthcare Provider</option>
                  <option value="specializedServiceProvider">Specialized Service Provider</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* Volunteers */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2 mb-2 font-semibold text-[#1c2b21]">
            <input
              type="checkbox"
              checked={formData.roles.volunteer}
              onChange={() => handleRoleToggle("volunteer")}
            />
            E. Volunteers — Provide Free Consultation, Training Services for Hemodialysis Patients
          </label>

          {formData.roles.volunteer && (
            <div className="mt-2">
              <label>
                Volunteer Tier:
                <select
                  value={formData.volunteerTier}
                  onChange={(e) => handleTierChange("volunteerTier", e.target.value)}
                  className="ml-2 p-2 border rounded border-gray-300"
                >
                  <option value="">Select Tier</option>
                  <option value="coreVolunteer">Core Volunteer</option>
                  <option value="projectBasedVolunteer">Project Based Volunteer</option>
                  <option value="occasionalVolunteer">Occasional Volunteer</option>
                  <option value="virtualVolunteer">Virtual Volunteer</option>
                  <option value="studentVolunteer">Student Volunteer</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* Additional Message */}
        <textarea
          name="message"
          placeholder="Message or additional info..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-[#1c2b21] font-semibold py-2 rounded-full hover:rounded-md transition"
        >
          Join Community
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">Ⓒ All rights reserved by Wanaw</p>
      </form>
    </div>
  );
};

export default SupportCommunityForm;

