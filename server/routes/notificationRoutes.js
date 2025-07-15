const express = require("express");
const router = express.Router();
const { sendGiftNotifications } = require("../controllers/notificationController");
// const auth = require("../middleware/auth"); ← Optional if you want to protect it

router.post("/send", sendGiftNotifications);

module.exports = router;


