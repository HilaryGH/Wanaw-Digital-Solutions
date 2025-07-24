const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { createMember } = require("../controllers/communityController");

router.post(
  "/",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "credentials", maxCount: 1 },
  ]),
  createMember
);

module.exports = router;
