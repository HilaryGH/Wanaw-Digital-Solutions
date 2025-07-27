const Job = require('../models/Job');

// Admin posts a new job
exports.createJob = async (req, res) => {
  const { title, description, location, employmentModel, specialization } = req.body;

  if (!title || !employmentModel || !specialization) {
    return res.status(400).json({ msg: 'Title, employment model, and specialization are required' });
  }

  try {
    const newJob = new Job({
      title,
      description,
      location,
      employmentModel,
      specialization,
    });

    await newJob.save();
    res.status(201).json({ msg: 'Job posted successfully', job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error posting job' });
  }
};

// Get all posted jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch jobs' });
  }
};

