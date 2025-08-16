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

// POST: Partner Request
router.post(
  "/partner-request",
  upload.fields([
    { name: "idOrPassport" },
    { name: "license" },
    { name: "tradeRegistration" },
    { name: "businessProposal" },
    { name: "businessPlan" },
    { name: "logo" },
    { name: "mouSigned" },
    { name: "contractSigned" },
  ]),
  async (req, res) => {
    try {
      console.log("📥 Body:", req.body);
      console.log("📁 Files:", req.files);

      const {
        tab,
        investmentType,
        sector,
        name,
        companyName,
        email,
        phone,
        officePhone,
        whatsapp,
        enquiry,
        motto,
        specialPackages,
        messages,
        coBrand,
        effectiveDate,
        expiryDate,
      } = req.body;

      const files = req.files;

      const newRequest = new PartnerRequest({
        tab,
        investmentType: tab === "Investor" && investmentType ? investmentType.split(",") : [],
        sector,
        name,
        companyName,
        email,
        phone,
        officePhone,
        whatsapp,
        enquiry,
        motto,
        specialPackages,
        messages,
        coBrand,
        effectiveDate: effectiveDate || null,
        expiryDate: expiryDate || null,
        idOrPassport: files?.idOrPassport?.[0]?.path || "",
        license: files?.license?.[0]?.path || "",
        tradeRegistration: files?.tradeRegistration?.[0]?.path || "",
        businessProposal: files?.businessProposal?.[0]?.path || "",
        businessPlan: files?.businessPlan?.[0]?.path || "",
        logo: files?.logo?.[0]?.path || "",
        mouSigned: files?.mouSigned?.[0]?.path || "",
        contractSigned: files?.contractSigned?.[0]?.path || "",
      });

      await newRequest.save();

      res.status(201).json({ message: "Partner request submitted successfully!" });
    } catch (err) {
      console.error("❌ Submission error:", err);
      res.status(500).json({ error: "Failed to submit partner request.", details: err.message });
    }
  }
);

// GET: All Partner Requests
router.get("/partner-requests", async (req, res) => {
  try {
    const partners = await PartnerRequest.find().sort({ createdAt: -1 });
    res.status(200).json(partners);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch partner requests.", details: err.message });
  }
});
const sendGiftEmail = require("../services/emailService");

// POST: Send email to all partners
router.post("/partner-notify", async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required." });
    }

    const partners = await PartnerRequest.find(); // fetch all partners

    const emailPromises = partners.map((partner) =>
      sendGiftEmail({
        to: partner.email,
        subject,
        text: message,
        html: `<p>${message}</p>`,
      })
    );

    await Promise.all(emailPromises);

    res.status(200).json({ message: "Emails sent successfully to all partners!" });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    res.status(500).json({ error: "Failed to send emails.", details: err.message });
  }
});

module.exports = router;


