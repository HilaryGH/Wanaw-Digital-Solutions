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
exports.getAllDiasporaMembers = async (req, res) => {
  try {
    const members = await DiasporaMember.find(); // You can use .sort() or .limit() here too if needed
    res.status(200).json(members);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch diaspora members" });
  }
};
