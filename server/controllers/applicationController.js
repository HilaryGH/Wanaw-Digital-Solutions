const Application = require('../models/Application');

const createApplication = async (req, res) => {
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

