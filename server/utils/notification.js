const twilio = require("twilio");
const nodemailer = require("nodemailer");
const axios = require("axios");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Email Sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., your Gmail
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to} — Subject: ${subject}`);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

exports.sendSMS = async ({ to, message }) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`📱 SMS sent to ${to}`);
  } catch (err) {
    console.error("SMS error:", err.message);
  }
};

exports.sendWhatsApp = async ({ to, message }) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
    });
    console.log(`🟢 WhatsApp sent to ${to}`);
  } catch (err) {
    console.error("WhatsApp error:", err.message);
  }
};

exports.sendTelegram = async ({ chatId, message }) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    console.log(`📨 Telegram sent to ${chatId}`);
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

