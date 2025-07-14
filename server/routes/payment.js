const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const paymentCtrl = require("../controllers/paymentController"); // ✅ only once

console.log("paymentCtrl keys →", Object.keys(paymentCtrl || {})); // safer version


router.post("/pay", verifyToken, paymentCtrl.initiateChapaPaymentSingle);
router.post("/pay-multiple", verifyToken, paymentCtrl.initiateChapaPaymentBulk);
router.post("/webhook/chapa", paymentCtrl.chapaWebhook);

module.exports = router;


