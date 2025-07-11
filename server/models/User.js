const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "provider", "admin"], default: "user" },
  membership: {
    type: String,
    enum: ["none", "basic", "premium", "enterprise"],
    default: "none",
  },
  googleId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);



