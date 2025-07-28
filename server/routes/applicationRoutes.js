const express = require('express');
const multer = require('multer');
const { createApplication, getApplicationsByJob } = require('../controllers/applicationController');

const router = express.Router();

// 1. Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 2. Apply multer middleware for file upload
router.post(
  '/:jobId',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'credentials', maxCount: 1 },
  ]),
  createApplication
);

// 3. Regular GET route
router.get('/:jobId', getApplicationsByJob);

module.exports = router;



