const express = require("express");
const router = express.Router();
const { createDiasporaMember } = require("../controllers/diasporaController");

router.post("/", createDiasporaMember);

module.exports = router;
