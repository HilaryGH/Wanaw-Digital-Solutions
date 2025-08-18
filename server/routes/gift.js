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
  getGiftsByService,  // ✅ updated
  getAllGiftCodes,
} = require("../controllers/giftController");

// ✅ Gift codes (admin / dashboard view)
router.get("/codes", verifyToken, getAllGiftCodes);

// ✅ Assign + confirm codes
router.post("/:giftId/assign-delivery-code", assignDeliveryCode);
router.post("/:giftId/confirm-gift", confirmGiftCode);

// ✅ Protected route for admins to create gifts
router.post("/", verifyToken, createGift);

// ✅ Get all gifts (optionally filter by serviceId in query)
router.get("/", getGifts);

// ✅ Delete gift
router.delete("/:id", deleteGift);

// ✅ Get gifts by service (instead of provider)
router.get("/service/:serviceId", verifyToken, getGiftsByService);

module.exports = router;


