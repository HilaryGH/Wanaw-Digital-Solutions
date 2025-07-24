const mongoose = require("mongoose");

const giftNotificationSchema = new mongoose.Schema(
  {
    occasionId: mongoose.Types.ObjectId,
    serviceId: mongoose.Types.ObjectId,
    senderName: String,

    recipient: {
      name: String,
      email: String,
      phone: String,
      whatsapp: String,
      telegram: String,
    },

    message: String,
    providerMessage: String,
    notifyProvider: Boolean,
    sentVia: [String], // e.g., ["email", "sms", "whatsapp"]
    status: { type: String, enum: ["pending", "success", "partial", "failed"] },

    // Delivery tracking fields
    giftCode: String, // 🔁 renamed from deliveryCode
    deliveryStatus: { type: String, enum: ["pending", "delivered"], default: "pending" },
    deliveredAt: Date,
    serviceProvider: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model("GiftNotification", giftNotificationSchema);


