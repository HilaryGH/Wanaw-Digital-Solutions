// routes/purchase.js (or controllers/purchaseController.js)
const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const Gift = require("../models/Gift");
const Service = require("../models/Service");

// GET purchases for a provider
router.get("/provider/:providerId/purchases", async (req, res) => {
  const { providerId } = req.params;

  try {
    // 1️⃣ Fetch all purchases for this provider
    const purchases = await Purchase.find({ providerId }).sort({ createdAt: -1 });

    // 2️⃣ Populate itemId manually based on itemType
    const populatedPurchases = await Promise.all(
      purchases.map(async (p) => {
        let populatedItem = null;

        if (p.itemType === "gift") {
          populatedItem = await Gift.findById(p.itemId).populate("providerId", "name email");
        } else if (p.itemType === "service") {
          populatedItem = await Service.findById(p.itemId).populate("providerId", "name email");
        }

        return {
          ...p.toObject(),
          itemId: populatedItem,
        };
      })
    );

    res.json(populatedPurchases);
  } catch (err) {
    console.error("❌ Error fetching provider purchases:", err);
    res.status(500).json({ msg: "Failed to fetch purchases", error: err.message });
  }
});

module.exports = router;


