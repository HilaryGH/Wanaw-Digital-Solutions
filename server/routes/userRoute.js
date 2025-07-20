// routes/userRoute.js
const express = require("express");
const { getAllUsers, updateMembership } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllUsers);
router.put("/:id/membership", verifyToken, isAdmin, updateMembership);

module.exports = router;
