const express = require("express");
const router = express.Router();
const { getProviderPurchases, updateGiftStatus } = require("../controllers/purchaseController");

// GET purchases for a provider with gifts included
router.get("/provider/:providerId/purchases", getProviderPurchases);


router.post("/gift/update-status", updateGiftStatus);

module.exports = router;
