const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schema for support request
const SupportRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SupportRequest = mongoose.model("SupportRequest", SupportRequestSchema);

// POST route to save support request
router.post("/", async (req, res) => {
  try {
    const newRequest = new SupportRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Support request submitted successfully" });
  } catch (error) {
    console.error("Error saving support request:", error);
    res.status(500).json({ error: "Server error. Could not save request." });
  }
});
// 📁 routes/support.js
router.get("/", async (req, res) => {
  try {
    const requests = await SupportRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch support requests" });
  }
});


module.exports = router;
