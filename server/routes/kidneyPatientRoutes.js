const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createKidneyPatient,
  getAllKidneyPatients,
} = require("../controllers/kidneyPatientController");

// Set multer to handle the file fields
const multiUpload = upload.fields([
  { name: "idDocument", maxCount: 1 },
  { name: "medicalCertificate", maxCount: 1 },
  { name: "videos", maxCount: 3 },
]);

router.post("/", multiUpload, createKidneyPatient);
router.get("/", getAllKidneyPatients);

module.exports = router;


