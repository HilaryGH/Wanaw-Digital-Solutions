const express = require("express");
const router = express.Router();
const { register, login, googleLogin } = require("../controllers/authController");

// Email/password routes
router.post("/register", register);
router.post("/login", login);

// ✅ Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://wanawhealthandwellness.netlify.app/dashboard",
    failureRedirect: "https://wanawhealthandwellness.netlify.app/login",
    session: true, // or false if you’ll issue JWT manually
  })
);

module.exports = router;



