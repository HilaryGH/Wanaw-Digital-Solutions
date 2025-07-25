// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const crypto = require("crypto"); // make sure it's required at the top if not already
const { sendEmail } = require("../utils/notification");



/* ────── role sets ────── */
const allowedRoles = ["individual", "provider", "corporate", "diaspora", "admin"];
const providerRoles = ["provider", "corporate"];

/* ─────────────────── REGISTER ─────────────────── */
exports.register = async (req, res) => {
  const fullName = req.body.fullName?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password;
  const role = req.body.role || "individual";
  const adminKey = req.body.adminKey;

  // For provider-specific
  const companyName = req.body.companyName?.trim();
  const serviceType = req.body.serviceType?.trim();
  const phone = req.body.phone?.trim();
  const whatsapp = req.body.whatsapp?.trim();
  const telegram = req.body.telegram?.trim();
  const city = req.body.city?.trim();
  const location = req.body.location?.trim();


  try {
    /* 1️⃣  Duplicate email check */
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    /* 2️⃣  Validate role */
    if (!allowedRoles.includes(role))
      return res.status(400).json({ msg: `Invalid role: ${role}` });

    /* 3️⃣  Admin guard */
    if (role === "admin" && adminKey !== process.env.ADMIN_KEY)
      return res.status(403).json({ msg: "Unauthorized to register as admin" });

    /* 4️⃣  If provider‑type role, validate required provider fields */
    if (providerRoles.includes(role)) {
      if (!companyName || !serviceType)
        return res.status(400).json({ msg: "Company name & service type are required" });
    }

    /* 5️⃣  Hash password (if supplied) */
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    /* 6️⃣  Extract file URLs if this was a multipart request */
    const getUrl = (f) => (f ? `/uploads/${f.filename}` : undefined);
    const licenseUrl = getUrl(req.files?.license?.[0]);
    const tradeRegUrl = getUrl(req.files?.tradeRegistration?.[0]);
    const photoUrls = (req.files?.servicePhotos || []).map(getUrl);
    const videoUrl = getUrl(req.files?.video?.[0]);

    /* 7️⃣  Build user object */
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
      role,

      /* provider‑specific fields (undefined for individuals) */
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

      /* default membership */
      membership: providerRoles.includes(role) ? "basic" : "none",
    };

    const user = await User.create(newUser);

    /* 8️⃣  JWT */
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
