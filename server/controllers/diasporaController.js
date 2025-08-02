const DiasporaMember = require("../models/DiasporaMember");

exports.createDiasporaMember = async (req, res) => {
  try {
    const newMember = new DiasporaMember(req.body);
    await newMember.save();
    res.status(201).json({ message: "Joined successfully" });
  } catch (error) {
    console.error("Diaspora submission error:", error);
    res.status(500).json({ message: "Submission failed" });
  }
};
