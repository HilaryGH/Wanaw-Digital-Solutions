// models/Provider.js
const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  serviceType: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  whatsapp: String,
  telegram: String,
  city: String,
  location: String,
  password: { type: String, required: true },
  // file URLs ↓ pulled from cloud storage after upload
  licenseUrl: String,
  tradeRegUrl: String,
  photoUrls: [String],
  videoUrl: String,
  membership: { type: String, default: "basic" },
  role: { type: String, default: "provider" },
});

module.exports = mongoose.model("Provider", providerSchema);
