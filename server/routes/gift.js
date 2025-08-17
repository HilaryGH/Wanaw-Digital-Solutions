const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");

const {
  createGift,
  getGifts,
  deleteGift,
  assignDeliveryCode,
  confirmGiftCode,
  getGiftsByService,
  getAllGiftCodes,
  purchaseGift,
} = require("../controllers/giftController");

// ✅ Gift codes (admin / dashboard view)
router.get("/codes", verifyToken, getAllGiftCodes);

// ✅ Assign + confirm codes (specific before general)
router.post("/:giftId/assign-delivery-code", assignDeliveryCode);
router.post("/:giftId/confirm-gift", confirmGiftCode);

// ✅ Get gifts by service (specific)
router.get("/service/:serviceId", verifyToken, getGiftsByService);
router.post("/:giftId/purchase", purchaseGift); // New route for gift purchase

// ✅ Get all gifts (general)
router.get("/", getGifts);

// ✅ Protected route for admins to create gifts
router.post("/", verifyToken, createGift);

// ✅ Delete gift
router.delete("/:id", deleteGift);

module.exports = router;


