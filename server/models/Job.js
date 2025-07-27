const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  employmentModel: {
    type: String,
    enum: ['Full Time', 'Freelance', 'Part-Time', 'Remote', 'On Demand'],
    required: true,
  },
  specialization: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);

