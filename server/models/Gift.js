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
 providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Provider" if you have a separate Provider model
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model("Gift", giftSchema);
