// routes/supportCommunityRoutes.js
const express = require("express");
const router = express.Router();
const { submitSupport } = require("../controllers/supportCommunityController");

router.post("/", submitSupport);


module.exports = router;
