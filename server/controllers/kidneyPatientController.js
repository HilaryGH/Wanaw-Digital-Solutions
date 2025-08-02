const KidneyPatient = require("../models/KidneyPatient");

const createKidneyPatient = async (req, res) => {
  try {
    // Build file paths from req.files
    const idDocument = req.files["idDocument"] ? req.files["idDocument"][0].filename : null;
    const medicalCertificate = req.files["medicalCertificate"] ? req.files["medicalCertificate"][0].filename : null;
    const videos = req.files["videos"] ? req.files["videos"].map(file => file.filename) : [];

    // Extract other form fields from req.body
    const {
      name,
      phone,
      whatsapp,
      telegram,
      email,
      facility,
      location,
      message,
    } = req.body;

    // Validate required fields manually (optional)
    if (!name || !phone || !whatsapp || !telegram || !email || !facility || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!idDocument || !medicalCertificate) {
      return res.status(400).json({ error: "Required documents are missing" });
    }

    // Create new document
    const newPatient = new KidneyPatient({
      name,
      phone,
      whatsapp,
      telegram,
      email,
      facilityName: facility,
      location,
      message,
      idDocument,
      medicalCertificate,
      videos,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    console.error("Error saving KidneyPatient:", err);
    res.status(500).json({ error: "Something went wrong", detail: err.message });
  }
};

const getAllKidneyPatients = async (req, res) => {
  try {
    const patients = await KidneyPatient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error("Error fetching KidneyPatients:", err);
    res.status(500).json({ error: "Failed to fetch patients", detail: err.message });
  }
};

module.exports = {
  createKidneyPatient,
  getAllKidneyPatients,
};

