const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 🔹 Shared fields for all roles
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // nullable for Google users
    role: {
      type: String,
      enum: ["individual", "provider", "corporate", "diaspora", "admin", "super_admin",
        "marketing_admin", "customer_support_admin"],

      default: "individual",
    },
    membership: {
      type: String,
      enum: [
        "Standard Member",
        "Gold Member",
        "Platinum Member",
        "Basic Provider",
        "Premium Provider",
      ],
      default: "Standard Member",
    },
    membershipId: { type: String, unique: true, required: true },



    googleId: { type: String }, // For Google login


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
    priceListUrl: { type: String },
    resetToken: { type: String },
    tokenExpire: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);




