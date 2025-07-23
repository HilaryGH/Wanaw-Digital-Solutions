const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 🔹 Shared fields for all roles
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // nullable for Google users
    role: {
      type: String,
      enum: ["individual", "provider", "corporate", "diaspora", "admin"],

      default: "individual",
    },

    googleId: { type: String }, // For Google login
    membership: {
      type: String,
      enum: ["none", "basic", "premium", "enterprise"],
      default: "none",
    },

    // 🔸 Provider-only fields (optional)
    companyName: { type: String },
    serviceType: { type: String },
    phone: { type: String },
    whatsapp: { type: String },
    telegram: { type: String },
    city: { type: String },
    location: { type: String },

    licenseUrl: { type: String },
    tradeRegUrl: { type: String },
    photoUrls: [String],
    videoUrl: { type: String },
    resetToken: { type: String },
    tokenExpire: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);




