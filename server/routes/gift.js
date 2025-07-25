const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  sendGift,
  sendProductGift,
  createGift,
  getGifts,
  deleteGift,
  assignDeliveryCode,
  confirmGiftCode, // <-- import this function from your controller
} = require("../controllers/giftController");

// Existing service gift email sender
router.post("/send-gift", sendGift);
router.post("/:giftId/assign-delivery-code", assignDeliveryCode);

// New product gift email sender
router.post("/send-product-gift", sendProductGift);

// Confirm gift code route — add this:
router.post("/:giftId/confirm-gift", confirmGiftCode);

// Apply upload middleware for file handling
router.post("/", upload.single("image"), createGift);

// Other gift routes
router.post("/", createGift);
router.get("/", getGifts);
router.delete("/:id", deleteGift);

module.exports = router;
