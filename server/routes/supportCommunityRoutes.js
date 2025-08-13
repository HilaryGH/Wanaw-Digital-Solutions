const express = require("express");
const router = express.Router();

// ✅ Import from the controller
const {
  submitSupport,
  getAllSupportSubmissions,
  getSupportByMembershipId
} = require("../controllers/supportCommunityController");

// ✅ Routes
router.post("/", submitSupport);
router.get("/", getAllSupportSubmissions);
router.get("/:membershipId", getSupportByMembershipId);

module.exports = router;

