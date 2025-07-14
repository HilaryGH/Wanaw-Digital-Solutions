const express = require("express");
const router = express.Router();
const paymentCtrl = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyToken");

router.post("/pay-multiple", verifyToken, paymentCtrl.initiateChapaPaymentBulk);
router.post("/webhook/chapa", paymentCtrl.chapaWebhook); // no auth for webhook

module.exports = router;


