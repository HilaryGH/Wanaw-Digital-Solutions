const { sendEmail, sendSMS, sendWhatsApp, sendTelegram } = require("./notification");

const sendNotifications = async ({ recipient, providerId, message }) => {
  const { email, phone, whatsapp, telegram, name } = recipient || {};

  // Send Email
  if (email) {
    await sendEmail({
      to: email,
      subject: "🎁 Gift/Service Delivery Confirmed",
      html: `<p>Dear ${name || "User"},</p><p>${message}</p>`,
    });
  }

  // Send SMS
  if (phone) {
    await sendSMS({
      to: phone,
      message,
    });
  }

  // Send WhatsApp
  if (whatsapp) {
    await sendWhatsApp({
      to: whatsapp,
      message,
    });
  }

  // Send Telegram
  if (telegram) {
    await sendTelegram({
      chatId: telegram,
      message,
    });
  }

  console.log("✅ Notifications sent.");
};

module.exports = sendNotifications;
