const mongoose = require("mongoose");

const KidneyPatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    telegram: { type: String, required: true },
    email: { type: String, required: true },
    facilityName: { type: String, required: true },
    location: { type: String, required: true },
    idDocument: { type: String, required: true },
    medicalCertificate: { type: String, required: true },
    message: { type: String },
    videos: [String],



    // ✅ New number field
    age: { type: Number, required: false }, // or `required: true` if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("KidneyPatient", KidneyPatientSchema);




