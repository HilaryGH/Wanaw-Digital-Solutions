const express = require("express");
const router = express.Router();
const { initiateChapaPayment } = require("../controllers/paymentController");

router.post("/pay", initiateChapaPayment);

module.exports = router;
