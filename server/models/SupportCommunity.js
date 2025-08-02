// models/SupportCommunity.js
const mongoose = require("mongoose");

const SupportCommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  region: String,
  supportTypes: [String],
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportCommunity", SupportCommunitySchema);

