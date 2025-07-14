// server/utils/notification.js

exports.sendEmail = (to, subject, body) => {
  console.log(`📧 Email sent to ${to} — Subject: ${subject}`);
  // TODO: Add actual email logic with nodemailer or email API
};

exports.sendSMS = (phone, message) => {
  console.log(`📱 SMS sent to ${phone} — Message: ${message}`);
  // TODO: Add actual SMS logic with Twilio or other API
};

exports.sendWhatsApp = (number, message) => {
  console.log(`🟢 WhatsApp sent to ${number} — Message: ${message}`);
  // TODO: Add actual WhatsApp logic with Twilio or other API
};