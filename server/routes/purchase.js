const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase"); // your purchase model
const verifyToken = require("../middleware/verifyToken");

// GET all purchases for a provider
router.get("/provider/:providerId/purchases", verifyToken, async (req, res) => {
  try {
    const { providerId } = req.params;

    // Validate providerId
    if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid provider ID" });
    }

    const purchases = await Purchase.find({ providerId }).populate("itemId");
    res.status(200).json(purchases);
  } catch (err) {
    console.error("❌ Error fetching provider purchases:", err);
    res.status(500).json({ msg: "Server error fetching purchases" });
  }
});

module.exports = router;

