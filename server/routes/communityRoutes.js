const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { createMember, getAllMembers, } = require("../controllers/communityController");

const isAdmin = require("../middleware/isAdmin");

router.post(
  "/",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "credentials", maxCount: 1 },
  ]),
  createMember
);
router.get("/", getAllMembers);

module.exports = router;
