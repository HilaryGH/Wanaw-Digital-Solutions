const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanaw-services", // Folder name on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  try {
    console.log("Uploaded file:", req.file);

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: "Image upload failed" });
  }
});


module.exports = router;
