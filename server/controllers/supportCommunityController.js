// controllers/supportCommunityController.js
const SupportCommunity = require("../models/SupportCommunity");

exports.submitSupport = async (req, res) => {
  try {
    const { name, email, phone, region, whatsapp,    // ✅ Add this
      telegram, supportTypes, message, userType } = req.body;

    const entry = new SupportCommunity({
      name, email, phone, region, whatsapp,    // ✅ Add this
      telegram, supportTypes, message, userType
    });
    await entry.save();

    res.status(201).json({ success: true, message: "Support form submitted successfully." });
  } catch (err) {
    console.error("SupportCommunity error →", err);
    res.status(500).json({ success: false, message: "Submission failed." });
  }
};

