const express = require("express");
const router = express.Router();
const { register, login, googleLogin } = require("../controllers/authController");

// Email/password routes
router.post("/register", register);
router.post("/login", login);

// ✅ Google login route
router.post("/google", googleLogin);

module.exports = router;



