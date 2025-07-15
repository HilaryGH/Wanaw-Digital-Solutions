// models/GiftNotification.js  (optional record‑keeping)
const mongoose = require("mongoose");

const giftNotificationSchema = new mongoose.Schema(
  {
    occasionId: mongoose.Types.ObjectId,
    serviceId: mongoose.Types.ObjectId,
    senderName: String,
    recipient: {
      email: String,
      phone: String,
      whatsapp: String,
      telegram: String,
    },
    message: String,
    providerMessage: String,
    notifyProvider: Boolean,
    sentVia: [String], // ["email","sms",...]
    status: { type: String, enum: ["success", "partial", "failed"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GiftNotification", giftNotificationSchema);
