const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const PartnerRequest = require("../models/PartnerRequest");

const router = express.Router();

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "wanaw-partners",
    format: file.mimetype === "application/pdf" ? "pdf" : undefined,
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "")}`,
  }),
});

const upload = multer({ storage });

// Route
router.post(
  "/partner-request",
  upload.fields([
    { name: "idOrPassport" },
    { name: "license" },
    { name: "tradeRegistration" },
    { name: "businessProposal" },
    { name: "businessPlan" },
  ]),
  async (req, res) => {
    try {
      console.log("📥 Received body:", req.body);
      console.log("📁 Received files:", req.files);

      const {
        tab,
        investmentType,
        name,
        companyName,
        email,
        phone,
        whatsapp,
        enquiry,
      } = req.body;

      const files = req.files;

      const newRequest = new PartnerRequest({
        tab,
        investmentType,
        name,
        companyName,
        email,
        phone,
        whatsapp,
        enquiry,
        idOrPassport: files?.idOrPassport?.[0]?.secure_url || "",
        license: files?.license?.[0]?.secure_url || "",
        tradeRegistration: files?.tradeRegistration?.[0]?.secure_url || "",
        businessProposal: files?.businessProposal?.[0]?.secure_url || "",
        businessPlan: files?.businessPlan?.[0]?.secure_url || "",
      });

      await newRequest.save();

      res.status(201).json({ message: "Partner request submitted successfully!" });
    } catch (err) {
      console.error("❌ Submission error:", err);
      res.status(500).json({
        error: "Failed to submit partner request.",
        details: err.message,
      });
    }
  }
);

module.exports = router;

