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
      providerName,
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
        subject: `You've received a thoughtful gift from <strong>${senderDisplayName}</strong>!`,
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Digital Solution</h2>
      </div>
      <div style="padding: 30px; background-color: #fff; color: #333;">
        <p style="font-size: 16px;">Hello ${recipientName || "there"},</p>
        <p style="font-size: 16px;">
          <strong>${senderDisplayName}</strong> has sent you a special gift through <strong>Wanaw Health & Wellness</strong>!
        </p>
        <ul style="font-size: 16px; padding-left: 20px;">
          ${occasionTitle ? `<li><strong>Occasion:</strong> ${occasionTitle}</li>` : ""}
          ${serviceTitle ? `<li><strong>Service:</strong> ${serviceTitle}</li>` : ""}
          ${providerDisplayName ? `<li><strong>Provider:</strong> ${providerDisplayName}</li>` : ""}
          ${locationDisplay ? `<li><strong>Location:</strong> ${locationDisplay}</li>` : ""}
        </ul>

        ${message ? `<p style="font-size: 16px;"><em>"${message}"</em></p>` : ""}

        ${hotelDetails
            ? `<div style="margin-top: 10px;">
              <p><strong>Booking Details:</strong></p>
              <ul style="font-size: 16px; padding-left: 20px;">
                <li>Check-in: ${checkInDate}</li>
                <li>Check-out: ${checkOutDate}</li>
                <li>Nights: ${nights}</li>
              </ul>
            </div>` : ""
          }

        <p style="font-size: 16px; margin-top: 20px;">
          Enjoy your experience — you've earned it!
        </p>

        <a href="https://wanawhealthandwellness.netlify.app/" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #D4AF37; color: #1c2b21; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Visit Wanaw
        </a>
      </div>
      <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color: #D4AF37;">
        &copy; ${new Date().getFullYear()} Wanaw Health & Wellness. All rights reserved.
      </div>
    </div>
  `,
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
    const provider = service.providerId;
    const providerContact = {
      email: provider?.email,
      phone: provider?.phone,
      whatsapp: provider?.whatsapp,
      telegram: provider?.telegram,
    };

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
          subject: "New Gift Order via Wanaw",
          html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #D4AF37;">🔔 New Gift Order</h2>
      </div>
      <div style="padding: 30px; background-color: #fff; color: #333;">
        <p style="font-size: 16px;">
          A customer has just sent a gift using your service.
        </p>
        <ul style="font-size: 16px; padding-left: 20px;">
          <li><strong>Recipient:</strong> ${recipientName}</li>
          <li><strong>Sender:</strong> ${senderDisplayName}</li>
          <li><strong>Occasion:</strong> ${giftOccasion || "N/A"}</li>
          <li><strong>Delivery Date:</strong> ${deliveryDate || "N/A"}</li>
          <li><strong>Service:</strong> ${serviceTitle || "N/A"}</li>
        </ul>

        ${providerMessage ? `<p style="font-size: 16px;"><strong>Note from sender:</strong> "${providerMessage}"</p>` : ""}

        ${checkInDate && checkOutDate
              ? `<div style="margin-top: 10px;">
              <p><strong>Booking Details:</strong></p>
              <ul style="font-size: 16px; padding-left: 20px;">
                <li>Check-in: ${checkInDate}</li>
                <li>Check-out: ${checkOutDate}</li>
                <li>Nights: ${nights}</li>
              </ul>
            </div>` : ""
            }

        <p style="font-size: 16px; margin-top: 20px;">
          Please prepare accordingly and contact the recipient if needed.
        </p>
      </div>
      <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color: #D4AF37;">
        &copy; ${new Date().getFullYear()} Wanaw Health & Wellness
      </div>
    </div>
  `,
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
exports.notifyProviderOfPurchase = async (service, buyerInfo, deliveryDate) => {
  const provider = service.providerId;
  let deliveryDateString = "";
  if (deliveryDate) {
    const d = new Date(deliveryDate);
    if (!isNaN(d)) {
      deliveryDateString = d.toLocaleString();
    }
  }

  await sendEmail({
    to: provider.email || process.env.NOTIFY_EMAIL,
    subject: `🎉 New Service Purchased: ${service.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://wanawhealthandwellness.netlify.app/WHW.jpg" alt="Wanaw Logo" style="max-width: 150px; height: auto;" />
        </div>
        <h2 style="color: #333; text-align: center;">🎉 New Service Purchased</h2>
        <div style="margin-top: 20px;">
          <p><strong>Service:</strong> <span style="color: #007BFF;">${service.title}</span></p>
          <p><strong>Price:</strong> <span style="color: #28a745;">$${service.price}</span></p>
          <p><strong>Buyer:</strong> ${buyerInfo.buyerName} (<a href="mailto:${buyerInfo.buyerEmail}" style="color: #007BFF;">${buyerInfo.buyerEmail}</a>)</p>
          ${deliveryDateString ? `<p><strong>Delivery Date:</strong> ${deliveryDateString}</p>` : ""}
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 15px;">Please log in to your dashboard to view and respond to the service request.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.CLIENT_DASHBOARD_URL || "#"}" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
        </div>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
        <footer style="text-align: center; font-size: 13px; color: #777;">
          <p>Need help? Contact us at <a href="mailto:support@wanaw.com" style="color: #007BFF;">support@wanaw.com</a></p>
          <p>© ${new Date().getFullYear()} Wanaw. All rights reserved.</p>
          <p>
            <a href="https://facebook.com/wanaw" style="color: #4267B2; margin: 0 6px;">Facebook</a> | 
            <a href="https://instagram.com/wanaw" style="color: #C13584; margin: 0 6px;">Instagram</a> | 
            <a href="https://wanaw.com" style="color: #007BFF; margin: 0 6px;">Website</a>
          </p>
        </footer>
      </div>
    `,
  });
};



