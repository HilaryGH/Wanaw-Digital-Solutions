/* controllers/notificationController.js */


const {
  sendEmail,
  sendSMS,
  sendWhatsApp,
  sendTelegram,
} = require("../utils/notification");
const Service = require('../models/Service'); // <-- then use it like below




/* ─── Helper to ensure +E.164 numbers ─── */
const formatNumber = (n) => {
  if (!n) return null;
  return /^\+/.test(n) ? n : `+${n}`;
};

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
      providerName,
      serviceLocation,
      giftSender,

      // 👇 Add these for Hotel-specific data
      checkInDate,
      checkOutDate,
      nights,
    } = req.body;


    const senderDisplayName = giftSender || senderName || "Anonymous";
    const providerDisplayName = providerName || "—";
    const locationDisplay = serviceLocation || "—";

    /* ---------- Main message to recipient ---------- */
    const hotelDetails = checkInDate && checkOutDate
      ? `
🏨 Check-in: ${checkInDate}
🏁 Check-out: ${checkOutDate}
🛏️ Nights: ${nights}
  `.trim()
      : "";

    const finalMessage = `
🎁 You've received a gift!

🎉 Occasion: ${occasionTitle || "—"}
🛍️ Service: ${serviceTitle || "—"}
🏢 Provider: ${providerDisplayName}
📍 Location: ${locationDisplay}
💬 Message: ${message?.trim() || "—"}
👤 From: ${senderDisplayName}
${hotelDetails ? "\n" + hotelDetails : ""}
`.trim();


    /* --- Send to recipient --- */
    if (recipientEmail)
      await sendEmail({
        to: recipientEmail,
        subject: "You've received a gift!",
        html: `<pre>${finalMessage}</pre>`,
      });

    if (recipientPhone)
      await sendSMS({
        to: formatNumber(recipientPhone),
        message: finalMessage,
      });

    if (recipientWhatsApp)
      await sendWhatsApp({
        to: formatNumber(recipientWhatsApp),
        message: finalMessage,
      });

    if (recipientTelegram)
      await sendTelegram({
        chatId: recipientTelegram,
        message: finalMessage,
      });

    /* --- Optional provider notification --- */
    if (notifyProvider && providerContact) {
      const providerHotelDetails = checkInDate && checkOutDate
        ? `
🏨 Check-in: ${checkInDate}
🏁 Check-out: ${checkOutDate}
🛏️ Nights: ${nights}
  `.trim()
        : "";

      const providerNote = `
🔔 A customer sent a gift related to your service.

🛍️ Service: ${serviceTitle || "—"}
📍 Location: ${locationDisplay}
💬 Customer note: ${providerMessage?.trim() || "—"}
👤 Sender: ${senderDisplayName}
${providerHotelDetails ? "\n" + providerHotelDetails : ""}
`.trim();

      if (providerContact.email)
        await sendEmail({
          to: providerContact.email,
          subject: "You have a new gift‑related message",
          html: `<pre>${providerNote}</pre>`,
        });

      if (providerContact.phone)
        await sendSMS({
          to: formatNumber(providerContact.phone),
          message: providerNote,
        });

      if (providerContact.whatsapp)
        await sendWhatsApp({
          to: formatNumber(providerContact.whatsapp),
          message: providerNote,
        });

      if (providerContact.telegram)
        await sendTelegram({
          chatId: providerContact.telegram,
          message: providerNote,
        });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Notification error →", error);
    return res.status(500).json({ error: "Failed to send notifications." });
  }
};



