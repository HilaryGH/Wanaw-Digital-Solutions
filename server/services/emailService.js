// services/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendGiftEmail({ to, subject, html, text }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // your app password
    },
  });

  await transporter.sendMail({
    from: `"Wanaw Gifting" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendGiftEmail;

