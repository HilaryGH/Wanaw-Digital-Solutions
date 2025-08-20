const express = require("express");
const router = express.Router();

const {
  checkAvailability,
  forwardToSupport,
} = require("../controllers/hotelController");

// Check hotel room availability
router.post("/check-availability", checkAvailability);

// Fallback if API fails
router.post("/support/availability-request", forwardToSupport);

module.exports = router;
