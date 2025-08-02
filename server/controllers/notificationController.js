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
      recipientName,
      giftOccasion,
      deliveryDate,
      serviceId,

      checkInDate,
      checkOutDate,
      nights,
    } = req.body;


    const senderDisplayName = giftSender || senderName || "Anonymous";

    const service = await Service.findById(req.body.serviceId).populate("providerId", "fullName location");


    if (!service) {
      console.error("Service not found with ID:", req.body.serviceId);
      throw new Error("Service not found");
    }

    console.log("Populated provider:", service.providerId);

    const providerDisplayName = service.providerId?.fullName || "—";
    const locationDisplay = service.location || "—";




    /* ---------- Main message to recipient ---------- */
    const hotelDetails = checkInDate && checkOutDate
      ? `
🏨 Check-in: ${checkInDate}
🏁 Check-out: ${checkOutDate}
🛏️ Nights: ${nights}
  `.trim()
      : "";

    const finalMessage = `
🎁 You are receiving a gift from: ${senderDisplayName}

🎉 Occasion: ${occasionTitle || ""}
🛍️ Service: ${serviceTitle || ""}
🏢 Service Provider: ${providerDisplayName}
📍 Location: ${locationDisplay}
💬 Message: ${message?.trim() || ""}
${hotelDetails ? "\n" + hotelDetails : ""}
`.trim();
    console.log({
      senderDisplayName,
      occasionTitle,
      serviceTitle,
      providerDisplayName,
      locationDisplay,
      message,
      hotelDetails,
    });



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
🔔 A customer just sent a gift using your service.

👤 Recipient: ${recipientName}
🎁 Gift Giver: ${senderDisplayName}
📝 Occasion: ${giftOccasion || "N/A"}
📅 Delivery Date: ${deliveryDate || "N/A"}
🛍️ Service: ${serviceTitle || "N/A"}
💬 Customer note: ${providerMessage?.trim() || ""}
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



