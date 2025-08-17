const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  itemType: { type: String, enum: ["service", "gift"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "itemType" },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  extraInfo: { type: Object }, // optional info like gift message or recipient
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
