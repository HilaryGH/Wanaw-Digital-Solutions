const Application = require('../models/Application');

// Create a new application
const createApplication = async (req, res) => {
  const { fullName, email, phone, coverLetter, credentialsLink } = req.body;
  const jobId = req.params.jobId;

  if (!fullName || !email || !jobId) {
    return res.status(400).json({ msg: 'Full name, email, and job ID are required.' });
  }

  try {
    const newApplication = new Application({
      fullName,
      email,
      phone,
      coverLetter,
      credentialsLink,
      job: jobId,
    });

    await newApplication.save();
    res.status(201).json({ msg: 'Application submitted successfully', application: newApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error submitting application' });
  }
};

// Get applications by job ID
const getApplicationsByJob = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const applications = await Application.find({ job: jobId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch applications' });
  }
};

module.exports = {
  createApplication,
  getApplicationsByJob,
};

