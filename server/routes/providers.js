const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const Provider = require("../models/Provider");

const router = express.Router();

// Storage setup for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "uploads/";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 ** 3 }, // 2GB limit
});

// POST /api/service-providers/register
router.post(
  "/register",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "tradeRegistration", maxCount: 1 },
    { name: "servicePhotos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        companyName,
        serviceType,
        email,
        phone,
        whatsapp,
        telegram,
        city,
        location,
        password,
        category, // Added category here
      } = req.body;

      // Validate required category field and check allowed values
      const allowedCategories = ["Diaspora", "Corporate", "Individual"]; // update as per your needs
      if (!category || !allowedCategories.includes(category)) {
        return res.status(400).json({ msg: "Invalid or missing provider category." });
      }

      // Prevent duplicates
      const exists = await Provider.findOne({ email });
      if (exists) return res.status(400).json({ msg: "Provider already exists" });

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Handle files
      const { license, tradeRegistration, servicePhotos, video } = req.files;

      const getUrl = (file) => (file ? `/uploads/${file.filename}` : null);
      const licenseUrl = getUrl(license?.[0]);
      const tradeRegUrl = getUrl(tradeRegistration?.[0]);
      const photoUrls = (servicePhotos || []).map(getUrl);
      const videoUrl = getUrl(video?.[0]);

      // Create provider with category included
      const provider = await Provider.create({
        companyName,
        serviceType,
        email,
        phone,
        whatsapp,
        telegram,
        city,
        location,
        password: hashed,
        licenseUrl,
        tradeRegUrl,
        photoUrls,
        videoUrl,
        category, // Include category here
      });

      // JWT Token
      const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(201).json({ provider, token });
    } catch (err) {
      console.error("🔥 Provider register error →", err);
      res.status(500).json({ msg: "Failed to register provider" });
    }
  }
);

module.exports = router;
