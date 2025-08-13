const Application = require('../models/Application');

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
    res.status(500).json({ msg: 'Server error submitting application' });
  }
};

// Get all applications 

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('job'); // if you have job reference
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};