const express = require("express");
const router = express.Router();
const Program = require("../models/Program");
const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // Adjust the path to where you export cloudinary
const verifyAdmin = (req, res, next) => {
  const isAdmin = req.headers.authorization === "Bearer your-admin-secret";
  if (!isAdmin) return res.status(403).json({ message: "Forbidden: Not Admin" });
  next();
};

// 🧠 Use memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST /api/programs
router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
  const { title, category } = req.body;
  const services = req.body.services;

  if (!title || !category || !services || !req.file) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // ⬆️ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: "wanaw-services",
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        // ✅ Save to DB
        const newProgram = new Program({
          title,
          category,
          image: result.secure_url,
          services: Array.isArray(services) ? services : [services],
        });

        const saved = await newProgram.save();
        return res.status(201).json(saved);
      }
    );

    // pipe image buffer to cloudinary
    if (req.file && req.file.buffer) {
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(uploadResult);
    }
  } catch (error) {
    console.error("❌ Error saving program:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

