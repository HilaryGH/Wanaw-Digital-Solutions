// routes/userRoute.js
const express = require("express");
const { getAllUsers, updateMembership } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllUsers);
router.put("/:id/membership", verifyToken, isAdmin, updateMembership);
// routes/userRoute.js
const { getCurrentUserProfile } = require("../controllers/authController"); // or wherever it is

router.get("/me", verifyToken, getCurrentUserProfile);


module.exports = router;
