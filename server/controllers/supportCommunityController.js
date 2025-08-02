// controllers/supportCommunityController.js
const SupportCommunity = require("../models/SupportCommunity");

exports.submitSupport = async (req, res) => {
  try {
    const { name, email, phone, region, supportTypes, message } = req.body;

    const entry = new SupportCommunity({ name, email, phone, region, supportTypes, message });
    await entry.save();

    res.status(201).json({ success: true, message: "Support form submitted successfully." });
  } catch (err) {
    console.error("SupportCommunity error →", err);
    res.status(500).json({ success: false, message: "Submission failed." });
  }
};

