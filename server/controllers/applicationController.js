const Application = require('../models/Application');


// Create a new application
exports.createApplication = async (req, res) => {
  const { fullName, email, phone, currentLocation, specialization, employmentModel } = req.body;
  const jobId = req.params.jobId;

  if (!fullName || !email || !jobId) {
    return res.status(400).json({ msg: 'Full name, email, and job ID are required.' });
  }

  try {
    const newApplication = new Application({
      fullName,
      email,
      phone,
      currentLocation,
      specialization,
      employmentModel,
      job: jobId,
      cvPath: req.files?.cv?.[0]?.path || null,
      credentialsPath: req.files?.credentials?.[0]?.path || null,
    });

    await newApplication.save();

    res.status(201).json({
      msg: 'Application submitted successfully',
      application: newApplication,
    });
  } catch (err) {
    console.error('❌ Error submitting application:', err);
    res.status(500).json({ msg: 'Server error submitting application', error: err.message });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('job'); // populate job details if needed
    res.status(200).json(applications);
  } catch (error) {
    console.error('❌ Fetch applications error:', error);
    res.status(500).json({ msg: 'Server error fetching applications', error: error.message });
  }
};

