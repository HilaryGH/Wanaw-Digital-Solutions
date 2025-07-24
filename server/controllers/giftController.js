const sendGiftEmail = require("../services/emailService");
const GiftNotification = require("../models/GiftNotification");


// Send email for a service gift
exports.sendGift = async (req, res) => {
  const { recipientEmail, message, service, senderName } = req.body;
  if (!recipientEmail || !service?.title) {
    return res.status(400).json({ msg: "Missing recipient or service info" });
  }

  const subject = `${senderName || "Someone"} sent you a gift!`;

  const html = `
  <h2>🎁 You've received a gift!</h2>
  <p><strong>Service:</strong> ${service.title}</p>
  <p><strong>Category:</strong> ${service.category}</p>
  <p><strong>Message:</strong> ${message || "No message provided"}</p>
  <p><strong>Delivery Code:</strong> <span style="font-size: 18px; color: blue;">${gift.deliveryCode}</span></p>
  <p style="margin-top:20px;">Visit Wanaw to explore more!</p>
`;

  const text = `
You've received a gift!
Service: ${service.title}
Category: ${service.category}
Message: ${message || "No message provided"}
Delivery Code: ${gift.deliveryCode}
`;


  try {
    await sendGiftEmail({ to: recipientEmail, subject, html, text });
    res.status(200).json({ msg: "Gift email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ msg: "Failed to send gift email" });
  }
};
// controllers/giftController.js
const Gift = require("../models/Gift");

exports.createGift = async (req, res) => {
  const { title, category, occasion, description, imageUrl } = req.body;

  if (!title || !category) {
    return res.status(400).json({ msg: "Title and category are required" });
  }

  try {
    const newGift = new Gift({
      title,
      category,
      occasion,
      description,
      imageUrl: imageUrl || "", // fallback if imageUrl is not provided
    });

    await newGift.save();
    res.status(201).json({ msg: "Gift added successfully", gift: newGift });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add gift" });
  }
};




// Send email for a product gift (gift items)
exports.sendProductGift = async (req, res) => {
  const { recipientEmail, message, gift, senderName } = req.body;

  if (!recipientEmail || !gift?.title) {
    return res.status(400).json({ msg: "Missing recipient or gift info" });
  }

  const subject = `${senderName || "Someone"} sent you a thoughtful gift from Wanaw!`;
  const html = `
    <h2>🎁 You've received a personalized gift!</h2>
    <p><strong>Gift:</strong> ${gift.title}</p>
    <p><strong>Category:</strong> ${gift.category}</p>
    <p><strong>Occasion:</strong> ${gift.occasion || "N/A"}</p>
    <p><strong>Message:</strong> ${message || "No message provided"}</p>
    <p style="margin-top:20px;">Visit <a href="https://wanaw.com" target="_blank">Wanaw.com</a> to explore more!</p>
  `;

  const text = `You’ve been gifted: ${gift.title}\nMessage: ${message}`;

  try {
    await sendGiftEmail({ to: recipientEmail, subject, html, text });
    res.status(200).json({ msg: "Gift product email sent successfully!" });
  } catch (error) {
    console.error("Gift email error:", error);
    res.status(500).json({ msg: "Failed to send gift email" });
  }
};
// Get all gifts
exports.getGifts = async (req, res) => {
  try {
    const gifts = await Gift.find();
    res.status(200).json(gifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch gifts" });
  }
};

// Delete a gift by ID
exports.deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    if (!gift) {
      return res.status(404).json({ msg: "Gift not found" });
    }
    res.status(200).json({ msg: "Gift deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete gift" });
  }
};

// Assign a 4-digit gift code and store recipient info
exports.assignDeliveryCode = async (req, res) => {
  try {
    const { giftId } = req.params;
    const { recipient, service, senderName = "Someone", message = "" } = req.body;

    if (!giftId || !recipient || (!recipient.email && !recipient.phone)) {
      console.log("❌ Missing required recipient info.");
      return res.status(400).json({ msg: "Missing required recipient info" });
    }

    // Generate 4-digit gift code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("✅ Generated gift code:", code);

    // Save to DB
    const notification = new GiftNotification({
      service,
      giftId,
      deliveryCode: code, // keep field name as-is if your DB uses deliveryCode
      recipient,
      status: "pending",
    });

    await notification.save();
    console.log("✅ Gift notification saved to database.");

    // 🔔 Send Email
    if (recipient.email) {
      const subject = `🎁 A special gift just for you from ${senderName}`;
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>🎉 You've received a gift!</h2>
          <p><strong>From:</strong> ${senderName}</p>
          <p><strong>Service:</strong> ${service?.title || "Not specified"}</p>
          <p><strong>Category:</strong> ${service?.category || "Not specified"}</p>
          <p><strong>Message:</strong> ${message?.trim() ? message : "No personal message was included."}</p>
          <p><strong>Your Gift Code:</strong> <span style="font-size: 20px; font-weight: bold; color: #007BFF;">${code}</span></p>
          <p style="margin-top: 20px;">
            🎁 Redeem your gift now at 
            <a href="https://wanawhealthandwellness.netlify.app" target="_blank">
              Wanaw Health & Wellness
            </a>
          </p>
        </div>
      `;

      const text = `
🎉 You've received a gift!

From: ${senderName}
Service: ${service?.title || "Not specified"}
Category: ${service?.category || "Not specified"}
Message: ${message?.trim() ? message : "No personal message was included."}
Your Gift Code: ${code}

🎁 Redeem your gift now:
https://wanawhealthandwellness.netlify.app
      `;

      try {
        await sendGiftEmail({ to: recipient.email, subject, html, text });
        console.log("📧 Gift email sent successfully.");
        res.status(200).json({ msg: "Gift code assigned and email sent", code });
      } catch (emailErr) {
        console.error("❌ Failed to send gift email:", emailErr);
        res.status(500).json({ msg: "Gift code assigned, but failed to send email" });
      }
    } else {
      res.status(200).json({ msg: "Gift code assigned (no email provided)", code });
    }
  } catch (err) {
    console.error("❌ Error assigning gift code:", err);
    res.status(500).json({ msg: "Server error while assigning gift code" });
  }
};
// Confirm gift code and update notification status


exports.confirmGiftCode = async (req, res) => {
  try {
    const { giftId } = req.params;
    const { code } = req.body;

    if (!giftId || !code) {
      console.log("❌ Missing gift ID or code in request.");
      return res.status(400).json({ msg: "Gift ID and code are required" });
    }

    // ✅ Find by ID and compare with giftCode
    const notification = await GiftNotification.findById(giftId);

    if (!notification || notification.giftCode !== code) {
      console.log("❌ Invalid gift code or gift ID.");
      return res.status(400).json({ msg: "Invalid gift code or gift ID" });
    }

    if (notification.deliveryStatus === "delivered") {
      return res.status(200).json({ msg: "Gift already confirmed", status: "delivered" });
    }

    // ✅ Update status and save
    notification.deliveryStatus = "delivered";
    notification.deliveredAt = new Date();
    await notification.save();

    console.log(`✅ Gift code confirmed for gift ID: ${giftId}`);

    res.status(200).json({
      msg: "Gift code confirmed successfully",
      status: "delivered",
      service: notification.service,
      recipient: notification.recipient,
    });

  } catch (err) {
    console.error("❌ Error confirming gift code:", err);
    res.status(500).json({ msg: "Server error confirming gift code" });
  }
};
