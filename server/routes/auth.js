const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const passport = require("passport");
const { register, login, sendPromo, resolveSupportIssue } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const authController = require("../controllers/authController");
const checkRole = require("../middleware/checkRole");



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

// Use multer middleware ONLY on register route (because login doesn't upload files)
router.post(
  "/register",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "tradeRegistration", maxCount: 1 },
    { name: "servicePhotos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  register
);

router.post("/login", login);

// Google OAuth2 routes unchanged
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://wanawhealthandwellness.netlify.app/individual-dashboard",
    failureRedirect: "https://wanawhealthandwellness.netlify.app/login",
    session: true,
  })
);

router.post("/forgot-password", authController.forgotPassword);
// ✅ FIXED VERSION
router.post("/reset-password/:token", authController.resetPassword);


router.get("/all-users", verifyToken, checkRole(["super_admin", "admin"]), getAllUsers);

router.post("/send-promo", verifyToken, checkRole(["marketing_admin", "super_admin"]), sendPromo);

router.post("/resolve-issue", verifyToken, checkRole(["customer_support_admin", "super_admin"]), resolveSupportIssue);



module.exports = router;





