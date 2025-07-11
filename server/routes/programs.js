const express = require("express");
const router = express.Router();
const Program = require("../models/Program");
const multer = require("multer");
const path = require("path");

// 🔐 Basic admin verification (can be replaced with real auth)
const verifyAdmin = (req, res, next) => {
  const isAdmin = req.headers.authorization === "Bearer your-admin-secret";
  if (!isAdmin) return res.status(403).json({ message: "Forbidden: Not Admin" });
  next();
};

// 🔧 Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });


// ✅ GET /api/programs - fetch all programs
router.get("/", async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ POST /api/programs - create new program with image
router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
  const { title, category } = req.body;
  const services = req.body.services; // ✅ FIXED HERE

  if (!title || !category || !services || !req.file) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newProgram = new Program({
      title,
      category,
      image: `/uploads/${req.file.filename}`,
      services: Array.isArray(services) ? services : [services],
    });

    const saved = await newProgram.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error saving program:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

