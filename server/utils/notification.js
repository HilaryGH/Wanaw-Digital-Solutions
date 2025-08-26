/* utils/notification.js */
require("dotenv").config(); // make sure .env is loaded

const twilio = require("twilio");
const nodemailer = require("nodemailer");
const axios = require("axios");

/* ────────────────────────────────────────────────────────── */
/* HELPERS                                                   */
/* ────────────────────────────────────────────────────────── */
const formatNumber = (n) => (n && /^\+/.test(n) ? n : n ? `+${n}` : null);
const logMissing = (what) => console.warn(`⚠️  Skipping ${what} → missing data/env.`);

/* ────────────────────────────────────────────────────────── */
/* TWILIO CONFIG                                             */
/* ────────────────────────────────────────────────────────── */
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  TWILIO_WHATSAPP_NUMBER,
  EMAIL_USER,
  EMAIL_PASS,
  TELEGRAM_BOT_TOKEN,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.warn("⚠️  Twilio credentials missing in .env — SMS/WhatsApp disabled.");
}
const twilioClient =
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

/* ────────────────────────────────────────────────────────── */
/* NODEMAILER CONFIG                                         */
/* ────────────────────────────────────────────────────────── */
let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    // tls: { rejectUnauthorized: false }, // uncomment only if necessary
  });
} else {
  console.warn("⚠️  EMAIL_USER or EMAIL_PASS missing — email disabled.");
}

/* ────────────────────────────────────────────────────────── */
/* EMAIL                                                     */
/* ────────────────────────────────────────────────────────── */
exports.sendEmail = async ({ to, subject, html }) => {
  if (!transporter) return logMissing("email (transporter not configured)");
  if (!to) return logMissing("email (no recipient)");
  try {
    await transporter.sendMail({ from: EMAIL_USER, to, subject, html });
    console.log(`📧 Email sent → ${to}`);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

/* ────────────────────────────────────────────────────────── */
/* SMS                                                       */
/* ────────────────────────────────────────────────────────── */
exports.sendSMS = async ({ to, message }) => {
  if (!twilioClient) return logMissing("SMS (Twilio not configured)");
  const formatted = formatNumber(to);
  if (!formatted) return logMissing("SMS (no recipient)");
  if (!TWILIO_PHONE_NUMBER) return logMissing("SMS (TWILIO_PHONE_NUMBER missing)");
  try {
    await twilioClient.messages.create({
      body: message || " ", // Twilio rejects completely empty body
      from: TWILIO_PHONE_NUMBER,
      to: formatted,
    });
    console.log(`📱 SMS sent → ${formatted}`);
  } catch (err) {
    console.error("SMS error:", err.message);
  }
};

/* ────────────────────────────────────────────────────────── */
/* WHATSAPP                                                  */
/* ────────────────────────────────────────────────────────── */
exports.sendWhatsApp = async ({ to, message }) => {
  if (!twilioClient) return logMissing("WhatsApp (Twilio not configured)");
  const formatted = formatNumber(to);
  if (!formatted) return logMissing("WhatsApp (no recipient)");
  if (!TWILIO_WHATSAPP_NUMBER?.startsWith("whatsapp:"))
    return logMissing("WhatsApp (TWILIO_WHATSAPP_NUMBER must start with whatsapp:+)");
  try {
    await twilioClient.messages.create({
      body: message || " ",
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${formatted}`,
    });
    console.log(`🟢 WhatsApp sent → ${formatted}`);
  } catch (err) {
    console.error("WhatsApp error:", err.message);
  }
};

/* ────────────────────────────────────────────────────────── */
/* TELEGRAM                                                  */
/* ────────────────────────────────────────────────────────── */
exports.sendTelegram = async ({ chatId, message }) => {
  if (!TELEGRAM_BOT_TOKEN) return logMissing("Telegram (bot token missing)");
  if (!chatId) return logMissing("Telegram (chatId missing)");
  const text = message?.trim() || "🎁 You have a new gift!";
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // username → ensure @; numeric → keep as is
  const id =
    /^[0-9-]+$/.test(String(chatId))
      ? chatId
      : `@${String(chatId).replace(/^@/, "")}`;

  try {
    await axios.post(url, { chat_id: id, text });
    console.log(`📨 Telegram sent → ${id}`);
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
  }
};

exports.sendMultiChannel = async ({ email, phone, whatsapp, telegram, subject, html, text }) => {
  const results = {};

  if (email) {
    try {
      await exports.sendEmail({ to: email, subject, html });
      results.email = true;
    } catch (err) {
      console.error("Email failed:", err.message);
      results.email = false;
    }
  }

  if (phone) {
    try {
      await exports.sendSMS({ to: phone, message: text || subject });
      results.sms = true;
    } catch (err) {
      console.error("SMS failed:", err.message);
      results.sms = false;
    }
  }

  if (whatsapp) {
    try {
      await exports.sendWhatsApp({ to: whatsapp, message: text || subject });
      results.whatsapp = true;
    } catch (err) {
      console.error("WhatsApp failed:", err.message);
      results.whatsapp = false;
    }
  }

  if (telegram) {
    try {
      await exports.sendTelegram({ chatId: telegram, message: text || subject });
      results.telegram = true;
    } catch (err) {
      console.error("Telegram failed:", err.message);
      results.telegram = false;
    }
  }

  return results;
};
