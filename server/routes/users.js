// server/routes/users.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const { getAllUsers, updateMembership } = require("../controllers/userController");

// GET /api/users/       → list all users (admin only)
router.get("/", verifyToken, isAdmin, getAllUsers);

// PUT /api/users/:id/membership → update membership (admin only)
router.put("/:id/membership", verifyToken, isAdmin, updateMembership);

module.exports = router;
