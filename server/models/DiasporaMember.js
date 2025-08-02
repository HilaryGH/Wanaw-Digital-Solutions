const mongoose = require("mongoose");

const diasporaMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  country: { type: String, required: true },
  profession: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DiasporaMember", diasporaMemberSchema);
