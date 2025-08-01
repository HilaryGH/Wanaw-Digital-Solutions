// server/controllers/userController.js
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    // Build filter conditionally
    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-password"); // exclude password

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};


exports.updateMembership = async (req, res) => {
  const { membership } = req.body;
  if (!["none", "basic", "premium", "enterprise"].includes(membership)) {
    return res.status(400).json({ msg: "Invalid membership" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.membership = membership;
    // If upgrading to provider
    if (["basic", "premium", "enterprise"].includes(membership)) {
      user.role = "provider";
    }
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update membership" });
  }
};
