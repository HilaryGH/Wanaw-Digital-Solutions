const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createService,
  getAllServices,
  getServiceById,
  deleteService,
  updateServiceStatus
} = require("../controllers/serviceController");

const verifyToken = require("../middleware/verifyToken");

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve uploads folder statically (should be done in main app.js or server.js, not here)
const app = express();
app.use("/uploads", express.static("uploads"));

// Routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", verifyToken, upload.single("image"), createService);
router.delete("/:id", deleteService);
router.put("/:id/status", updateServiceStatus);

module.exports = router;


