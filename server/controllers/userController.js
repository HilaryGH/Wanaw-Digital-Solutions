// server/controllers/userController.js
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching users" });
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
