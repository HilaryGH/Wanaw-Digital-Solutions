const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  initiateChapaPaymentSingle,
  initiateChapaPaymentBulk,
  chapaWebhook
} = require("../controllers/paymentController");


// ✅ Apply routes
router.post("/pay", verifyToken, initiateChapaPaymentSingle);
router.post("/pay-multiple", verifyToken, initiateChapaPaymentBulk);
router.post("/webhook/chapa", chapaWebhook);

module.exports = router;


