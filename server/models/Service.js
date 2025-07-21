const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: ["Wellness", "Medical", "Home Based/Mobile Services", "Hotel"]
    },
    subcategory: { type: String }, // ✅ Add this line
    price: { type: Number, required: true },
    duration: { type: String },
    tags: [String],
    imageUrl: String,
    location: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);


