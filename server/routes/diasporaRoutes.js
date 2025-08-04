const express = require("express");
const router = express.Router();
const { createDiasporaMember, getAllDiasporaMembers } = require("../controllers/diasporaController");

router.post("/", createDiasporaMember);
router.get("/all", getAllDiasporaMembers);

module.exports = router;
