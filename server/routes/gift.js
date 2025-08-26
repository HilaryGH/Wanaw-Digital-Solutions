const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");

const {
  createGift,
  getAllGifts,
  deleteGift,
  confirmGiftCode,
  getGiftsByService,  // ✅ updated
  getAllGiftCodes,
  getAllGiftsWithCodes
} = require("../controllers/giftController");

// ✅ Gift codes (admin / dashboard view)
router.get("/codes", verifyToken, getAllGiftCodes);

// ✅ Assign + confirm codes

router.post("/:giftId/confirm-gift", confirmGiftCode);
router.get("/with-codes", getAllGiftsWithCodes);


// ✅ Protected route for admins to create gifts
router.post("/", verifyToken, createGift);



// ✅ Delete gift
router.delete("/:id", deleteGift);
// Get all gifts
router.get("/", getAllGifts);

// ✅ Get gifts by service (instead of provider)
router.get("/service/:serviceId", verifyToken, getGiftsByService);

module.exports = router;


