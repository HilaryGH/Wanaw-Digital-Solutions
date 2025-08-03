const sendGiftEmail = require("../services/emailService");
const GiftNotification = require("../models/GiftNotification");
const Service = require('../models/Service'); // <-- then use it like below



const Gift = require('../models/Gift');
// controllers/giftController.js
exports.createGift = async (req, res) => {
  const {
    title,
    category,
    occasion,
    description,
    imageUrl,
    senderName,  // new field
    recipientId, // expect recipient id as input
    serviceId    // expect service id as input
  } = req.body;

  const user = req.user;
  const allowedRoles = ["admin", "super_admin", "marketing_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return res.status(403).json({ msg: "Unauthorized" });
  }



  if (!title || !category) {
    return res.status(400).json({ msg: "Title and category are required" });
  }

  try {
    // Check if the provided serviceId is valid and exists
    if (serviceId) {
      const existingService = await Service.findById(serviceId);
      if (!existingService) {
        return res.status(404).json({ msg: "Service not found with the given ID" });
      }
    }

    const newGift = new Gift({
      title,
      category,
      occasion,
      description,
      imageUrl: imageUrl || "",
      senderName: senderName || user.name || "Admin",
      recipient: recipientId,
      service: serviceId,
      providerId: user._id,
    });

    await newGift.save();
    return res.status(201).json({ msg: "Gift added successfully", gift: newGift });
  } catch (err) {
    console.error("Error saving gift:", err.message, err);
    return res.status(500).json({ msg: "Failed to add gift", error: err.message });
  }

};
// Get all gifts
exports.getGifts = async (req, res) => {
  const { providerId } = req.query;

  try {
    const query = providerId ? { providerId } : {};

    const gifts = await Gift.find(query)
      .populate("service", "title category")      // populate service with only title & category fields
      .populate("recipient", "name email phone")  // populate recipient with needed fields
      .sort({ createdAt: -1 });

    res.status(200).json(gifts);
  } catch (err) {
    console.error("❌ Error fetching gifts:", err);
    res.status(500).json({ msg: "Server error fetching gifts" });
  }
};

exports.getGiftsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const gifts = await Gift.find({ providerId });
    res.json(gifts);
  } catch (err) {
    console.error("❌ Error fetching provider gifts:", err);
    res.status(500).json({ msg: "Server error" });
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
      giftCode: code,   // <-- updated here to match schema
      recipient,
      status: "pending",
      providerId: service.provider?._id,
      providerName: service.provider?.name || "",
      serviceLocation: service.location || "",
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
      return res.status(400).json({ msg: "Gift ID and code are required" });
    }

    const notification = await GiftNotification.findOne({ giftId, giftCode: code });

    if (!notification) {
      return res.status(400).json({ msg: "Invalid gift code or gift ID" });
    }

    if (notification.deliveryStatus === "delivered") {
      return res.status(200).json({
        msg: "Gift already confirmed",
        status: "delivered",
        service: notification.service,
        recipient: notification.recipient,
      });
    }

    // ✅ Mark as delivered
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

