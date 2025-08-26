const mongoose = require("mongoose");

const giftNotificationSchema = new mongoose.Schema(
  {

    occasionId: mongoose.Types.ObjectId,
    serviceId: mongoose.Types.ObjectId,

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The person who is sending the gift
    },
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

    // Delivery tracking
    giftCode: String,
    deliveryStatus: { type: String, enum: ["pending", "delivered"], default: "pending" },
    deliveredAt: Date,

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Business user offering the service
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Make sure you have a Service model
    },

    providerName: String,             // <-- Add this
    serviceLocation: String,

    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase',
    },
    giftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gift",
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("GiftNotification", giftNotificationSchema);



