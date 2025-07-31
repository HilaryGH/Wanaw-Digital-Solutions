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

  senderName: { type: String }, // NEW: Optional sender name

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you store recipients in the User collection
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // assuming services are stored separately
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Provider" if separate
    required: true,
  },
}, { timestamps: true });


module.exports = mongoose.model("Gift", giftSchema);
