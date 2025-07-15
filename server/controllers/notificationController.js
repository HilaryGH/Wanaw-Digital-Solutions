const {
  sendEmail,
  sendSMS,
  sendWhatsApp,
  sendTelegram,
} = require("../utils/notification");

exports.sendGiftNotifications = async (req, res) => {
  try {
    const {
      recipientEmail,
      recipientPhone,
      recipientWhatsApp,
      recipientTelegram,
      message,
      senderName,
      serviceTitle,
      occasionTitle,
      notifyProvider,
      providerMessage,
      providerContact,
    } = req.body;

    const finalMessage = `
🎁 You've received a gift!

🎉 Occasion: ${occasionTitle || "—"}
🛍️ Service: ${serviceTitle}
💬 Message: ${message || "—"}
👤 From: ${senderName}
    `;

    if (recipientEmail) await sendEmail(recipientEmail, "You've received a gift!", finalMessage);
    if (recipientPhone) await sendSMS(recipientPhone, finalMessage);
    if (recipientWhatsApp) await sendWhatsApp(recipientWhatsApp, finalMessage);
    if (recipientTelegram) await sendTelegram(recipientTelegram, finalMessage);

    if (notifyProvider && providerContact) {
      const providerNote = `
🔔 You've been notified by a gift sender

🛍️ Service: ${serviceTitle}
💬 Message from sender: ${providerMessage || "—"}
👤 Sender: ${senderName}
      `;
      if (providerContact.email) await sendEmail(providerContact.email, "New gift-related message", providerNote);
      if (providerContact.phone) await sendSMS(providerContact.phone, providerNote);
      if (providerContact.whatsapp) await sendWhatsApp(providerContact.whatsapp, providerNote);
      if (providerContact.telegram) await sendTelegram(providerContact.telegram, providerNote);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Notification error →", error);
    res.status(500).json({ error: "Failed to send notifications." });
  }
};


