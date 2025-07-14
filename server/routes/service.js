const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createService,
  getAllServices,
  getServiceById,
  deleteService,
  updateServiceStatus,
} = require("../controllers/serviceController");

const verifyToken = require("../middleware/verifyToken");

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes

// GET all services
router.get("/", getAllServices);

// GET service by id
router.get("/:id", getServiceById);

// POST create service (with image upload and token verification)
router.post("/", verifyToken, upload.single("image"), createService);

// DELETE service by id
router.delete("/:id", verifyToken, deleteService); // Add verifyToken here for safety

// PUT update service status
router.put("/:id/status", verifyToken, updateServiceStatus); // Add verifyToken here as well

module.exports = router;


