const express = require('express');
const router = express.Router();
const { createApplication, getApplicationsByJob } = require('../controllers/applicationController');

router.post('/:jobId', createApplication);
router.get('/:jobId', getApplicationsByJob);

module.exports = router;


