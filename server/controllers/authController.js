// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const crypto = require("crypto"); // make sure it's required at the top if not already
const { sendEmail } = require("../utils/notification");



/* ────── role sets ────── */
const allowedRoles = ["individual", "provider", "corporate", "diaspora", "admin", "super_admin", "marketing_admin", "customer_support_admin"];
const providerRoles = ["provider", "corporate"];

/* ─────────────────── REGISTER ─────────────────── */
exports.register = async (req, res) => {
  const fullName = req.body.fullName?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password;
  const role = req.body.role || "individual";
  let membership = req.body.membership?.trim();  // `let` because you may override it later
  const adminKey = req.body.adminKey;

  // For provider-specific
  const companyName = req.body.companyName?.trim();
  const serviceType = req.body.serviceType?.trim();
  const phone = req.body.phone?.trim();
  const whatsapp = req.body.whatsapp?.trim();
  const telegram = req.body.telegram?.trim();
  const city = req.body.city?.trim();
  const location = req.body.location?.trim();


  const getUrl = (f) => (f ? `/uploads/${f.filename}` : undefined);
  const priceListUrl = getUrl(req.files?.priceList?.[0]);


  const membershipOptions = {
    individual: ["Standard Member", "Gold Member", "Platinum Member"],
    diaspora: ["Standard Member", "Gold Member", "Platinum Member"],
    corporate: ["Standard Member", "Gold Member", "Platinum Member"],
    provider: ["Basic Provider", "Premium Provider"],
  };

  // Helper function to generate membership ID
  const generateMembershipId = () => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = Date.now().toString().slice(-6);
    return `MEM${randomPart}${timestampPart}`;
  };

  try {
    /* 1️⃣ Duplicate email check */
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    /* 2️⃣ Validate role */
    if (!allowedRoles.includes(role))
      return res.status(400).json({ msg: `Invalid role: ${role}` });

    /* 3️⃣ Admin guard */
    if (role === "admin" && adminKey !== process.env.ADMIN_KEY)
      return res.status(403).json({ msg: "Unauthorized to register as admin" });

    /* 4️⃣ If provider-type role, validate required provider fields */
    if (providerRoles.includes(role)) {
      if (!companyName || !serviceType)
        return res.status(400).json({ msg: "Company name & service type are required" });
    }

    /* 5️⃣ Validate membership if provided */
    if (membership) {
      if (!membershipOptions[role]?.includes(membership)) {
        return res.status(400).json({ msg: `Invalid membership for role ${role}: ${membership}` });
      }
    } else {
      // Default membership if none provided
      membership = providerRoles.includes(role) ? "Basic Provider" : "Standard Member";
    }

    /* 6️⃣ Hash password (if supplied) */
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    /* 7️⃣ Extract file URLs if multipart */

    const licenseUrl = getUrl(req.files?.license?.[0]);
    const tradeRegUrl = getUrl(req.files?.tradeRegistration?.[0]);
    const photoUrls = (req.files?.servicePhotos || []).map(getUrl);
    const videoUrl = getUrl(req.files?.video?.[0]);

    /* 8️⃣ Generate membership ID */
    const membershipId = generateMembershipId();

    /* 9️⃣ Build user object */
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      role,
      membership,
      membershipId,

      companyName,
      serviceType,
      phone,
      whatsapp,
      telegram,
      city,
      location,
      licenseUrl,
      tradeRegUrl,
      photoUrls,
      videoUrl,
      priceListUrl,
    };

    /* 🔟 Create user in DB */
    const user = await User.create(newUser);

    /* 1️⃣1️⃣ Send welcome email */
    await sendEmail({
      to: user.email,
      subject: "Welcome to Wanaw Health and Wellness!",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
      <h1 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Digital Solution</h1>
    </div>
    <div style="padding: 30px; background-color: #fff;">
      <h2 style="color: #1c2b21;">Welcome, ${user.fullName}!</h2>

      <p style="font-size: 16px; color: #333;">
        Thank you for registering as a <strong>${user.membership}</strong> on our platform.
      </p>

      <div style="margin: 30px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #D4AF37;">
        <p style="font-size: 18px; color: #1c2b21; margin: 0;">
          🎉 Your Membership ID:
        </p>
        <p style="font-size: 28px; font-weight: bold; color: #D4AF37; margin: 5px 0 0;">${user.membershipId}</p>
      </div>

      <p style="font-size: 16px; color: #333;">
        We’re excited to have you onboard and look forward to supporting your health and wellness journey.
      </p>

      <a href="https://wanawhealthandwellness.netlify.app/" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #D4AF37; color: #1c2b21; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Visit Wanaw Health and Wellness
      </a>

      <p style="font-size: 16px; color: #333; margin-top: 30px;">
        If you have any questions or need assistance, just reply to this email.
      </p>
<p style="font-size: 16px; color: #333; margin-top: 20px;">
  ⭐ Don’t miss out! Your feedback, reviews, and ratings help us improve and provide better services tailored to your needs.
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
Hello ${user.fullName},

Thank you for registering as a ${user.membership} on our platform.

Your Membership ID: ${user.membershipId}

We’re excited to have you onboard!

Visit Wanaw Health and Wellness: https://wanawhealthandwellness.netlify.app/

If you have any questions or need assistance, just reply to this email.


With care,
The Wanaw Team
  `
    });


    /* 1️⃣2️⃣ Respond with JWT + user info */
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        membership: user.membership,
        membershipId: user.membershipId,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Error registering user" });
  }
};


/* ─────────────────── LOGIN (unchanged except extra log) ─────────────────── */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login failed" });
  }
};

/* ─────────────────── createService helper (unchanged) ─────────────────── */
exports.createService = async (req, res) => {
  const user = req.user; // populated by auth middleware

  if (user.role !== "provider")
    return res.status(403).json({ msg: "Only service providers can create services" });

  const allowedMemberships = ["basic", "premium", "enterprise"];
  if (!allowedMemberships.includes(user.membership))
    return res.status(403).json({ msg: "Upgrade your membership to list services." });

  const service = await Service.create({ ...req.body, providerId: user._id });
  res.status(201).json(service);
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.tokenExpire = Date.now() + 1000 * 60 * 15; // valid for 15 minutes
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.fullName || "there"},</p>
        <p>You requested a password reset.</p>
        <p><a href="${resetLink}" target="_blank">Click here to reset your password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, just ignore this email.</p>
      `,
    });

    res.status(200).json({ msg: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpire: { $gt: Date.now() }, // not expired
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpire = undefined;

    await user.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.sendPromo = async (req, res) => {
  try {
    // Logic to send promo (e.g., via email or notifications)
    const { message, recipients } = req.body;

    // Dummy example
    console.log("Sending promo to:", recipients);
    console.log("Message:", message);

    res.status(200).json({ msg: "Promotion sent successfully." });
  } catch (err) {
    console.error("Promo Error:", err);
    res.status(500).json({ msg: "Failed to send promotion." });
  }
};
exports.resolveSupportIssue = async (req, res) => {
  try {
    // Your logic here
    res.status(200).json({ msg: "Issue resolved." });
  } catch (err) {
    res.status(500).json({ msg: "Failed to resolve issue." });
  }
};

// Get a single user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
// auth.js or userController.js
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // verifyToken middleware should set req.user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
