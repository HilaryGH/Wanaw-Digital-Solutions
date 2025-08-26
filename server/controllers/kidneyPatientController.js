const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const KidneyPatient = require("../models/KidneyPatient");

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // supports images, videos, PDFs
    });
    fs.unlinkSync(filePath); // Remove local file after upload
    return result.secure_url; // ✅ Cloudinary URL
  } catch (error) {
    fs.unlinkSync(filePath); // Clean up even on error
    throw error;
  }
};

// Controller to create a kidney patient
const createKidneyPatient = async (req, res) => {
  try {
    const {
      name,
      phone,
      whatsapp,
      telegram,
      email,
      facilityName,
      location,
      message,
      age,
    } = req.body;

    // Upload files to Cloudinary
    let idDocumentUrl = null;
    let medicalCertificateUrl = null;
    let videoUrls = [];

    if (req.files?.idDocument?.[0]) {
      idDocumentUrl = await uploadToCloudinary(
        req.files.idDocument[0].path,
        "id_documents"
      );
    }

    if (req.files?.medicalCertificate?.[0]) {
      medicalCertificateUrl = await uploadToCloudinary(
        req.files.medicalCertificate[0].path,
        "medical_certificates"
      );
    }

    if (req.files?.videos) {
      for (const file of req.files.videos) {
        const videoUrl = await uploadToCloudinary(file.path, "kidney_videos");
        videoUrls.push(videoUrl);
      }
    }

    // Debug logs
    console.log("✅ Uploaded files:");
    console.log("ID Document:", idDocumentUrl);
    console.log("Medical Certificate:", medicalCertificateUrl);
    console.log("Videos:", videoUrls);

    // Save patient with Cloudinary URLs
    const newPatient = new KidneyPatient({
      name,
      phone,
      whatsapp,
      telegram,
      email,
      facilityName,
      location,
      message,
      age,
      idDocument: idDocumentUrl,          // ✅ Cloudinary URL
      medicalCertificate: medicalCertificateUrl, // ✅ Cloudinary URL
      videos: videoUrls,                  // ✅ Cloudinary URLs array
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    console.error("❌ KidneyPatient creation error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Controller to fetch all patients
const getAllKidneyPatients = async (req, res) => {
  try {
    const patients = await KidneyPatient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error("❌ Error fetching KidneyPatients:", err);
    res.status(500).json({ error: "Failed to fetch patients", detail: err.message });
  }
};

module.exports = {
  createKidneyPatient,
  getAllKidneyPatients,
};

