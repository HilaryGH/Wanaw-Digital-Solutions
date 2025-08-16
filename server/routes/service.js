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
  purchaseService,
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

router.post("/:id/purchase", purchaseService);

// DELETE service by id
router.delete("/:id", verifyToken, deleteService); // Add verifyToken here for safety

// PUT update service status
router.put("/:id/status", verifyToken, updateServiceStatus);
router.get("/provider/:providerId/services", verifyToken, async (req, res) => {
  try {
    const { providerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ msg: "Invalid provider ID" });
    }

    const services = await Service.find({ providerId })
      .select("_id title category"); // only send needed fields

    res.status(200).json(services);
  } catch (err) {
    console.error("❌ Error fetching provider services:", err);
    res.status(500).json({ msg: "Server error fetching services" });
  }
});

module.exports = router;
