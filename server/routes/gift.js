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
  getGiftsByProvider,
} = require("../controllers/giftController");



router.post("/:giftId/assign-delivery-code", assignDeliveryCode);
router.post("/:giftId/confirm-gift", confirmGiftCode);

// ✅ Protected route for admins with file upload
router.post("/", verifyToken, upload.single("image"), createGift);

// ✅ Other routes
router.get("/", getGifts);
router.delete("/:id", deleteGift);
router.get("/provider/:providerId", verifyToken, getGiftsByProvider);

module.exports = router;

