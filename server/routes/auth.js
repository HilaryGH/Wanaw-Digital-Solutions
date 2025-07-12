const express = require("express");
const router = express.Router();
const passport = require("passport");

const { register, login, googleLogin } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// Google OAuth2
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://wanawhealthandwellness.netlify.app/dashboard",
    failureRedirect: "https://wanawhealthandwellness.netlify.app/login",
    session: true, // or false if using JWT
  })
);

module.exports = router;




