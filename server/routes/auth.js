const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const passport = require("passport");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const authController = require("../controllers/authController");
const { getAllUsers } = require("../controllers/userController");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "uploads/";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 ** 3 }, // 2GB
});

// -------------------- AUTH ROUTES --------------------

// Register user
router.post(
  "/register",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "tradeRegistration", maxCount: 1 },
    { name: "servicePhotos", maxCount: 5 },
    { name: "video", maxCount: 1 },
    { name: "priceList", maxCount: 1 },
  ]),
  authController.register
);

// Login
router.post("/login", authController.login);

// Google OAuth2
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://wanawhealthandwellness.netlify.app/individual-dashboard",
    failureRedirect: "https://wanawhealthandwellness.netlify.app/login",
    session: true,
  })
);

// Forgot / Reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Current logged-in user
router.get("/me", verifyToken, authController.getCurrentUserProfile);
router.put("/me", verifyToken, authController.updateCurrentUserProfile);

// Admin / Super admin routes
router.get("/all-users", verifyToken, checkRole(["super_admin", "admin"]), getAllUsers);
router.post("/send-promo", verifyToken, checkRole(["marketing_admin", "super_admin"]), authController.sendPromo);
router.post("/resolve-issue", verifyToken, checkRole(["customer_support_admin", "super_admin"]), authController.resolveSupportIssue);

// Get user by ID
router.get("/users/:id", verifyToken, authController.getUserProfile);


module.exports = router;






