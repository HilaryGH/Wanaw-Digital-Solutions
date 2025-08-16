const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  currentLocation: String,       // New field
  specialization: String,        // New field
  employmentModel: String,       // New field
  cvPath: String,                // New field for uploaded CV
  credentialsPath: String,       // New field for uploaded credentials
  coverLetter: String,
  credentialsLink: String,
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);

