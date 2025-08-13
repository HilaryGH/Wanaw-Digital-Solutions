const SupportCommunity = require("../models/SupportCommunity");
const { sendEmail } = require("../utils/notification"); // adjust path if needed

// Helper to generate membership ID
function generateMembershipId() {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestampPart = Date.now().toString().slice(-6);
  return `SUP${randomPart}${timestampPart}`; // 'SUP' prefix for support community
}

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

    // Generate membership ID
    const membershipId = generateMembershipId();

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
      membershipId, // new field added here
    });

    await entry.save();

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: "Your Support Community Membership ID",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
      <h1 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Support Community</h1>
    </div>
    <div style="padding: 30px; background-color: #fff;">
      <h2 style="color: #1c2b21;">Hello, ${name}!</h2>

      <p style="font-size: 16px; color: #333;">
        Thank you for submitting your support request and joining our Support Community.
      </p>

      <div style="margin: 30px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #D4AF37;">
        <p style="font-size: 18px; color: #1c2b21; margin: 0;">
          🎉 Your Membership ID:
        </p>
        <p style="font-size: 28px; font-weight: bold; color: #D4AF37; margin: 5px 0 0;">${membershipId}</p>
      </div>

      <p style="font-size: 16px; color: #333;">
        We appreciate your involvement and look forward to working together towards impactful change.
      </p>

      <a href="https://wanawhealthandwellness.netlify.app/" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #D4AF37; color: #1c2b21; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Visit Wanaw Health and Wellness
      </a>

      <p style="font-size: 16px; color: #333; margin-top: 30px;">
        If you have any questions or need assistance, simply reply to this email.
      </p>
      <p style="font-size: 16px; color: #333; margin-top: 20px;">
        ⭐ Your participation means a lot — together, we can make a difference!
      </p>

      <p style="font-size: 16px; color: #333;">
        With care,<br/>
        <strong>The Wanaw Team</strong>
      </p>
    </div>
    <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color:#D4AF37;">
      &copy; ${new Date().getFullYear()} Wanaw Health and Wellness Digital Solution. All rights reserved.
    </div>
  </div>
  `,
      text: `
Hi ${name},

Thank you for submitting your support request and joining our Support Community.

Your Membership ID: ${membershipId}

We appreciate your involvement and look forward to working together towards impactful change.

Visit Wanaw Health and Wellness: https://wanawhealthandwellness.netlify.app/

If you have any questions or need assistance, simply reply to this email.

With care,
The Wanaw Team
  `,
    });


    res.status(201).json({
      success: true,
      message: "Support form submitted successfully.",
      membershipId, // include membershipId in response
    });
  } catch (err) {
    console.error("SupportCommunity error →", err);
    res.status(500).json({ success: false, message: "Submission failed." });
  }
};

exports.getAllSupportSubmissions = async (req, res) => {
  try {
    const allSupports = await SupportCommunity.find();
    res.status(200).json({
      success: true,
      data: allSupports,
    });
  } catch (err) {
    console.error("Error fetching support submissions →", err);
    res.status(500).json({ success: false, message: "Failed to fetch submissions." });
  }
};
// GET /api/support/:membershipId
exports.getSupportByMembershipId = async (req, res) => {
  try {
    const { membershipId } = req.params;
    const entry = await SupportCommunity.findOne({ membershipId });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "No support record found for that Membership ID.",
      });
    }

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (err) {
    console.error("Error fetching support by membershipId →", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch record.",
    });
  }
};





