const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
exports.register = async (req, res) => {
  const { fullName, email, password, role = "user", adminKey } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    // Prevent assigning admin role unless correct key is provided
    if (role === "admin") {
      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ msg: "Unauthorized to register as admin" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role, // set role (default "user", or "admin" if verified)
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Error registering user" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

// ✅ Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        googleId,
        password: "", // no password for Google users
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(401).json({ msg: "Google authentication failed" });
  }
};

exports.createService = async (req, res) => {
  const user = req.user; // assuming you attach user via middleware

  if (user.role !== "provider") {
    return res.status(403).json({ msg: "Only service providers can create services" });
  }

  const allowedMemberships = ["basic", "premium", "enterprise"];
  if (!allowedMemberships.includes(user.membership)) {
    return res.status(403).json({ msg: "Upgrade your membership to list services." });
  }

  // Proceed with creating the service
  const service = await Service.create({ ...req.body, providerId: user._id });
  res.status(201).json(service);
};




