const SupportCommunity = require("../models/SupportCommunity");

exports.submitSupport = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      region,
      whatsapp,
      telegram,
      supportTypes,
      message,
      userType,
      role, // single role (optional)
      roles, // multiple roles
      influencerTier,
      influencerRoles,
      brandAmbassadorTier,
      brandAmbassadorRoles,
      serviceProviderTier,
      volunteerTier,
    } = req.body;

    // Convert roles object { gifter: true, influencer: false, ... } to array of selected roles
    let finalRoles = [];
    if (Array.isArray(roles)) {
      finalRoles = roles;
    } else if (roles && typeof roles === "object") {
      finalRoles = Object.keys(roles).filter((r) => roles[r] === true);
    }

    if (role && !finalRoles.includes(role)) {
      finalRoles.push(role);
    }

    // Map roles to correct enum strings
    const roleMap = {
      gifter: "Gifter",
      influencer: "Influencer",
      "brandambassador": "Brand Ambassador",
      "serviceprovider": "Service Provider",
      volunteer: "Volunteer",
    };

    finalRoles = finalRoles
      .map((r) => {
        const key = r.toLowerCase().replace(/\s+/g, "");
        return roleMap[key] || r; // fallback to original if no mapping
      })
      .filter((r) => r); // remove falsy values

    if (finalRoles.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one valid role is required." });
    }

    // Clean tier fields: convert empty string to null
    function cleanTier(tier) {
      return tier === "" ? null : tier;
    }

    const entry = new SupportCommunity({
      name,
      email,
      phone,
      region,
      whatsapp,
      telegram,
      supportTypes,
      message,
      userType,
      roles: finalRoles,
      influencerTier: cleanTier(influencerTier),
      influencerRoles,
      brandAmbassadorTier: cleanTier(brandAmbassadorTier),
      brandAmbassadorRoles,
      serviceProviderTier: cleanTier(serviceProviderTier),
      volunteerTier: cleanTier(volunteerTier),
    });

    await entry.save();

    res.status(201).json({
      success: true,
      message: "Support form submitted successfully.",
    });
  } catch (err) {
    console.error("SupportCommunity error →", err);
    res.status(500).json({ success: false, message: "Submission failed." });
  }
};



