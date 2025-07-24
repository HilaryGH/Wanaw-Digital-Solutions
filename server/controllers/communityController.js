const CommunityMember = require("../models/CommunityMember");

exports.createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      location,
      specialization,
      internshipPeriod,
      memberType,
    } = req.body;

    const files = req.files;

    const cvUrl = files?.cv?.[0]?.path;
    const credentialsUrl = files?.credentials?.[0]?.path;

    if (!cvUrl || !credentialsUrl) {
      return res.status(400).json({ message: "Both CV and Credentials are required." });
    }

    const newMember = new CommunityMember({
      name,
      email,
      phone,
      whatsapp,
      location,
      specialization,
      internshipPeriod,
      memberType,
      cvUrl,
      credentialsUrl,
    });

    await newMember.save();

    res.status(201).json({ message: "Membership form submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting membership form:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
