const express = require('express');
const multer = require('multer');
const { createApplication, getAllApplications } = require('../controllers/applicationController');
const Application = require('../models/Application');
const sendGiftEmail = require('../services/emailService');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
router.post(
  '/:jobId',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'credentials', maxCount: 1 },
  ]),
  createApplication
);

router.get('/', getAllApplications);

// ✅ Admin: send email to all applicants (logic in route)
router.post('/notify', async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });

    const applicants = await Application.find();
    const emails = applicants.map(a => a.email).filter(Boolean);

    if (emails.length === 0) return res.status(404).json({ error: 'No applicant emails found.' });

    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          await sendGiftEmail({ to: email, subject, text: message, html: `<p>${message}</p>` });
          return { email, status: 'sent' };
        } catch (err) {
          console.error(`❌ Failed to send email to ${email}:`, err.message);
          return { email, status: 'failed', error: err.message };
        }
      })
    );

    const sentCount = results.filter(r => r.status === 'sent').length;
    const failedEmails = results.filter(r => r.status === 'failed');

    res.status(200).json({
      msg: `Emails sent: ${sentCount}, Failed: ${failedEmails.length}`,
      failedEmails,
    });
  } catch (err) {
    console.error('❌ Error sending applicant emails:', err);
    res.status(500).json({ error: 'Failed to send emails.', details: err.message });
  }
});

module.exports = router;



