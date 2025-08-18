const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["corporate", "individual"], required: true },
  occasion: { type: String },
  receiverType: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  tags: [String],
  isActive: { type: Boolean, default: true },

  senderName: { type: String },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ← Add this field
  code: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Gift", giftSchema);

