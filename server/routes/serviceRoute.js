const express = require("express");
const router = express.Router();
const { purchaseService } = require("../controllers/serviceController");

console.log("purchaseService is a function:", typeof purchaseService === "function");



router.post("/:id/purchase", purchaseService);

// ✅ EXPORT the router!
module.exports = router;

