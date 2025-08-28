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
      digitalCreator: false,
      brandAmbassador: false,
      serviceProvider: false,
      volunteer: false,
    },
    gifterLevel: "individual",
    influencerLevel: "",
    influencerRoles: [] as string[],
    digitalCreatorLevel: "",
    digitalCreatorRoles: [] as string[],
    digitalCreatorFiles: {
    photos: [] as File[],
    videos: [] as File[],
    docs: [] as File[],
  },
    brandAmbassadorLevel: "",
    brandAmbassadorRoles: [] as string[],
    serviceProviderLevel: "",
    volunteerLevel: "",
    message: "",
  });

const handleRoleToggle = (role: keyof typeof formData.roles) => {
  setFormData((prev) => ({
    ...prev,
    roles: Object.keys(prev.roles).reduce(
      (acc, key) => ({ ...acc, [key]: key === role }),
      {} as typeof prev.roles
    ),
    ...(role === "gifter" ? { gifterLevel: "individual" } : { gifterLevel: "" }),
    ...(role === "influencer" ? { influencerLevel: "", influencerRoles: [] } : { influencerLevel: "", influencerRoles: [] }),
    ...(role === "digitalCreator" ? { digitalCreatorLevel: "", digitalCreatorRoles: [] } : { digitalCreatorLevel: "", digitalCreatorRoles: [] }),
    ...(role === "brandAmbassador" ? { brandAmbassadorLevel: "", brandAmbassadorRoles: [] } : { brandAmbassadorLevel: "", brandAmbassadorRoles: [] }),
    ...(role === "serviceProvider" ? { serviceProviderLevel: "" } : { serviceProviderLevel: "" }),
    ...(role === "volunteer" ? { volunteerLevel: "" } : { volunteerLevel: "" }),
  }));
};


  const handleLevelChange = (
    roleLevelKey:
      | "gifterLevel"
      | "influencerLevel"
      | "digitalCreatorLevel"
      | "brandAmbassadorLevel"
      | "serviceProviderLevel"
      | "volunteerLevel",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [roleLevelKey]: value,
    }));
  };

  const handleMultiRoleChange = (
    roleKey: "influencerRoles" | "digitalCreatorRoles" | "brandAmbassadorRoles",
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

  // ✅ Basic validation
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

    // Convert roles object to array
    const rolesArray: string[] = [];
    if (formData.roles.gifter) rolesArray.push("Gifter");
    if (formData.roles.influencer) rolesArray.push("Influencer");
    if (formData.roles.digitalCreator) rolesArray.push("Digital Creator");
    if (formData.roles.brandAmbassador) rolesArray.push("Brand Ambassador");
    if (formData.roles.serviceProvider) rolesArray.push("Service Provider");
    if (formData.roles.volunteer) rolesArray.push("Volunteer");

    // ✅ Use FormData for files + text
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("phone", formData.phone || "");
    formPayload.append("region", formData.region || "");
    formPayload.append("whatsapp", formData.whatsapp || "");
    formPayload.append("telegram", formData.telegram || "");
    formPayload.append("userType", formData.userType);
    formPayload.append("roles", JSON.stringify(rolesArray));
    formPayload.append("digitalCreatorTier", formData.digitalCreatorLevel || "");
    formPayload.append("digitalCreatorRoles", JSON.stringify(formData.digitalCreatorRoles));
    formPayload.append("message", formData.message || "");

    // ✅ Append files for Digital Creator
    if (formData.roles.digitalCreator && formData.digitalCreatorFiles) {
      const { photos = [], videos = [], docs = [] } = formData.digitalCreatorFiles;
      photos.forEach((file) => formPayload.append("photos", file));
      videos.forEach((file) => formPayload.append("videos", file));
      docs.forEach((file) => formPayload.append("docs", file));
    }

    // ✅ Send to backend
    const res = await fetch(`${BASE_URL}/support-community`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formPayload,
    });

    if (!res.ok) throw new Error("Submission failed");

    // ✅ Generate certificate after successful submission
    generateCertificate({
      name: formData.name,
      role: rolesArray[0] || "Member",
      level:
        formData.gifterLevel ||
        formData.influencerLevel ||
        formData.digitalCreatorLevel ||
        formData.brandAmbassadorLevel ||
        formData.serviceProviderLevel ||
        formData.volunteerLevel,
    });

    alert("Thank you for joining the Support Community!");
    navigate("/community/hemodialysis");
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute top-0 left-0 w-24 sm:w-40 h-24 sm:h-40 bg-[#1c2b21] rounded-full opacity-40 animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-40 sm:w-60 h-40 sm:h-60 bg-[#1c2b21] rounded-full opacity-30 animate-spin-slow z-0"></div>
      <div className="absolute top-10 left-10 w-24 sm:w-40 h-24 sm:h-40 bg-[#1c2b21] rounded-full opacity-40 animate-pulse z-0"></div>
      <div className="absolute -top-10 right-10 w-20 sm:w-32 h-20 sm:h-32 bg-[#D4AF37] rotate-45 rounded-lg opacity-50 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-3xl bg-white shadow-2xl rounded-xl p-6 sm:p-8 space-y-6 relative"
      >
        <div className="absolute -top-5 left-5 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-md">
          Join Support Community
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1c2b21]">
          Wanaw Lewegenachen Hiwot
        </h2>
        <p className="text-center font-bold text-gold mb-4 text-base sm:text-lg">
          “ዋናው ለወገናችን ሂወት”
        </p>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="p-2 border rounded border-gray-300 w-full" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="p-2 border rounded border-gray-300 w-full" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="p-2 border rounded border-gray-300 w-full" />
          <input name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} className="p-2 border rounded border-gray-300 w-full" />
          <input name="telegram" placeholder="Telegram" value={formData.telegram} onChange={handleChange} className="p-2 border rounded border-gray-300 w-full" />
          <input name="region" placeholder="City / Region" value={formData.region} onChange={handleChange} className="p-2 border rounded border-gray-300 w-full" />
        </div>

        {/* Roles */}
        {[
          { key: "gifter", label: "A. Gifters — Send Gift for preferable Hemodialysis Patients Treatments", select: { options: ["individual", "corporate"] } },
          { key: "influencer", label: "B. Influencers — Promote your preferable Hemodialysis Patient" },
          { key: "digitalCreator", label: "C. Digital Creators — Share Content to Support Hemodialysis Patients" },
          { key: "brandAmbassador", label: "D. Brand Ambassadors — Promote Wanaw Support Community Program" },
          { key: "serviceProvider", label: "E. Service Providers — Provide Health Service" },
          { key: "volunteer", label: "F. Volunteers — Support Community Program" }
        ].map((role, index) => (
          <div key={index} className="border p-4 rounded">
            <label className="flex items-start sm:items-center gap-2 mb-2 font-semibold text-[#1c2b21] text-sm sm:text-base">
              <input type="checkbox" checked={formData.roles[role.key as keyof typeof formData.roles]} onChange={() => handleRoleToggle(role.key as keyof typeof formData.roles)} className="mt-1 sm:mt-0" />
              {role.label}
            </label>

            {/* Additional controls per role */}
            {role.key === "gifter" && formData.roles.gifter && (
              <select value={formData.gifterLevel} onChange={(e) => handleLevelChange("gifterLevel", e.target.value)} className="p-2 border rounded border-gray-300 w-full sm:w-auto">
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
              </select>
            )}

            {role.key === "influencer" && formData.roles.influencer && (
              <>
                <select value={formData.influencerLevel} onChange={(e) => handleLevelChange("influencerLevel", e.target.value)} className="p-2 border rounded border-gray-300 w-full sm:w-auto mt-2">
                  <option value="">Select Level</option>
                  <option value="Mega Influencer">Mega Influencer</option>
                  <option value="Macro Influencer">Macro Influencer</option>
                  <option value="Micro Influencer">Micro Influencer</option>
                  <option value="Nano Influencer">Nano Influencer</option>
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {["Tiktok live", "YouTube live", "Post/Share Content", "Instagram live"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.influencerRoles.includes(item)} onChange={(e) => handleMultiRoleChange("influencerRoles", item, e.target.checked)} />
                      <span className="text-sm sm:text-base">{item}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {role.key === "digitalCreator" && formData.roles.digitalCreator && (
  <>
    <select
      value={formData.digitalCreatorLevel}
      onChange={(e) => handleLevelChange("digitalCreatorLevel", e.target.value)}
      className="p-2 border rounded border-gray-300 w-full sm:w-auto mt-2"
    >
      <option value="">Select Level</option>
      <option value="Professional Creator">Professional Creator</option>
      <option value="Community Creator">Community Creator</option>
      <option value="Casual Creator">Casual Creator</option>
    </select>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {["Video Content", "Blog/Articles", "Graphics/Designs", "Photography"].map((item) => (
        <label key={item} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.digitalCreatorRoles.includes(item)}
            onChange={(e) =>
              handleMultiRoleChange("digitalCreatorRoles", item, e.target.checked)
            }
          />
          <span className="text-sm sm:text-base">{item}</span>
        </label>
      ))}
    </div>

    {/* File Uploads */}
    <div className="mt-3 space-y-2">
      <label className="block text-sm font-semibold text-[#1c2b21]">
        Upload Photos
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              digitalCreatorFiles: {
                ...prev.digitalCreatorFiles,
                photos: e.target.files ? Array.from(e.target.files) : [],
              },
            }))
          }
          className="mt-1 block w-full text-sm border rounded p-2"
        />
      </label>

      <label className="block text-sm font-semibold text-[#1c2b21]">
        Upload Videos
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              digitalCreatorFiles: {
                ...prev.digitalCreatorFiles,
                videos: e.target.files ? Array.from(e.target.files) : [],
              },
            }))
          }
          className="mt-1 block w-full text-sm border rounded p-2"
        />
      </label>

      <label className="block text-sm font-semibold text-[#1c2b21]">
        Upload Documents
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              digitalCreatorFiles: {
                ...prev.digitalCreatorFiles,
                docs: e.target.files ? Array.from(e.target.files) : [],
              },
            }))
          }
          className="mt-1 block w-full text-sm border rounded p-2"
        />
      </label>
    </div>
  </>
)}


            {role.key === "brandAmbassador" && formData.roles.brandAmbassador && (
              <>
                <select value={formData.brandAmbassadorLevel} onChange={(e) => handleLevelChange("brandAmbassadorLevel", e.target.value)} className="p-2 border rounded border-gray-300 w-full sm:w-auto mt-2">
                  <option value="">Select Level</option>
                  <option value="Celebrity Ambassador">Celebrity Ambassador</option>
                  <option value="Community Advocate">Community Advocate</option>
                  <option value="Industry Expert">Industry Expert</option>
                  <option value="Customer Ambassador">Customer Ambassador</option>
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {["Tiktok", "LinkedIn", "Instagram", "Facebook", "Personal Networks"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.brandAmbassadorRoles.includes(item)} onChange={(e) => handleMultiRoleChange("brandAmbassadorRoles", item, e.target.checked)} />
                      <span className="text-sm sm:text-base">{item}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {role.key === "serviceProvider" && formData.roles.serviceProvider && (
              <select value={formData.serviceProviderLevel} onChange={(e) => handleLevelChange("serviceProviderLevel", e.target.value)} className="p-2 border rounded border-gray-300 w-full sm:w-auto mt-2">
                <option value="">Select Level</option>
                <option value="primaryHealthcareProvider">Primary Healthcare Provider</option>
                <option value="specializedServiceProvider">Specialized Service Provider</option>
              </select>
            )}

            {role.key === "volunteer" && formData.roles.volunteer && (
              <select value={formData.volunteerLevel} onChange={(e) => handleLevelChange("volunteerLevel", e.target.value)} className="p-2 border rounded border-gray-300 w-full sm:w-auto mt-2">
                <option value="">Select Level</option>
                <option value="coreVolunteer">Core Volunteer</option>
                <option value="projectBasedVolunteer">Project Based Volunteer</option>
                <option value="occasionalVolunteer">Occasional Volunteer</option>
                <option value="virtualVolunteer">Virtual Volunteer</option>
                <option value="studentVolunteer">Student Volunteer</option>
              </select>
            )}
          </div>
        ))}

        {/* Message */}
        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border rounded border-gray-300 min-h-[80px]"
        ></textarea>

        <button
          type="submit"
          className="w-full py-2 bg-[#1c2b21] text-white font-bold rounded hover:bg-[#0f1a14] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupportCommunityForm;




