const sendGiftEmail = require("../services/emailService");
const GiftNotification = require("../models/GiftNotification");
const Service = require('../models/Service'); // <-- then use it like below
const mongoose = require("mongoose");



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
// Get all gifts (optionally filter by serviceId)
exports.getGifts = async (req, res) => {
  try {
    const { serviceId } = req.query;

    // Build query object
    const query = {};
    if (serviceId) {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ msg: "Invalid serviceId" });
      }
      query.service = serviceId;
    }

    const gifts = await Gift.find(query)
      .populate("service", "title category")
      .populate("recipient", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(gifts); // always return array
  } catch (err) {
    console.error("❌ Error fetching gifts:", err);
    res.status(500).json({ msg: "Server error fetching gifts" });
  }
};

// Get gifts by service (route param)
exports.getGiftsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ msg: "Invalid serviceId" });
    }

    const gifts = await Gift.find({ service: serviceId })
      .populate("service", "title category")
      .populate("recipient", "name email phone")
      .sort({ createdAt: -1 });

    if (!gifts.length) {
      return res.status(200).json({ msg: "No gifts found for this service", gifts: [] });
    }

    res.status(200).json(gifts);
  } catch (err) {
    console.error("❌ Error fetching service gifts:", err);
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
    const { recipient, service: serviceInput, senderName = "Someone", message = "" } = req.body;

    if (!giftId || !recipient || (!recipient.email && !recipient.phone)) {
      return res.status(400).json({ msg: "Missing required recipient info" });
    }

    // Fetch service and populate provider info
    const service = await Service.findById(serviceInput._id).populate("providerId", "name email phone");
    if (!service) return res.status(404).json({ msg: "Service not found" });

    // Generate 4-digit gift code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Save to DB
    const notification = new GiftNotification({
      service: service._id,
      giftId,
      giftCode: code,
      recipient: {
        name: recipient.name || "N/A",
        email: recipient.email || "",
        phone: recipient.phone || "",
        whatsapp: recipient.whatsapp || "",
        telegram: recipient.telegram || "",
      },
      status: "pending",
      providerId: service.providerId._id,
      providerName: service.providerId.name,
      serviceLocation: service.location || "N/A",
    });

    await notification.save();

    // Prepare recipient email content
    const subject = `🎁 A special gift just for you from ${senderName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Digital Solution</h1>
        </div>
        <div style="padding: 30px; background-color: #fff;">
          <h2 style="color: #1c2b21;">🎁 You've received a gift!</h2>
          <p style="font-size: 16px; color: #333;"><strong>From:</strong> ${senderName}</p>
          <p style="font-size: 16px; color: #333;">
            <strong>Service:</strong> ${service.title}<br/>
            <strong>Category:</strong> ${service.category}<br/>
            <strong>Location:</strong> ${service.location || "N/A"}
          </p>
          <p style="font-size: 16px; color: #333;">
            <strong>Message:</strong> ${message?.trim() ? message : "No personal message was included."}
          </p>
          <div style="margin: 30px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #D4AF37;">
            <p style="font-size: 18px; color: #1c2b21; margin: 0;">🎉 Your Gift Code:</p>
            <p style="font-size: 28px; font-weight: bold; color: #D4AF37; margin: 5px 0 0;">${code}</p>
          </div>
          <p style="font-size: 16px; color: #333;">Redeem your gift by visiting our platform below:</p>
          <a href="https://wanawhealthandwellness.netlify.app/" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #D4AF37; color: #1c2b21; text-decoration: none; border-radius: 4px; font-weight: bold;">Redeem at Wanaw</a>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">If you have any questions or need support, just reply to this email.</p>
          <p style="font-size: 16px; color: #333;">With care,<br/><strong>The Wanaw Team</strong></p>
        </div>
        <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color:#D4AF37;">
          &copy; ${new Date().getFullYear()} Wanaw Health and Wellness Digital Solution. All rights reserved.
        </div>
      </div>
    `;
    const text = `
You've received a gift from ${senderName}!

Service: ${service.title}
Category: ${service.category}
Location: ${service.location || "N/A"}
Message: ${message?.trim() ? message : "No personal message was included."}

Your Gift Code: ${code}

Redeem your gift by visiting: https://wanawhealthandwellness.netlify.app/
`;

    // Send email to recipient
    let recipientEmailSent = false;
    if (recipient.email) {
      try {
        await sendGiftEmail({ to: recipient.email, subject, html, text });
        recipientEmailSent = true;
      } catch (emailErr) {
        console.error("❌ Failed to send gift email to recipient:", emailErr);
      }
    }

    // Send notification email to provider
    if (service.providerId && service.providerId.email) {
      const providerSubject = `🎁 A gift was assigned for your service: ${service.title}`;
      const providerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
          <h2>New Gift Assigned</h2>
          <p><strong>Service:</strong> ${service.title}</p>
          <p><strong>Recipient Name:</strong> ${recipient.name || "N/A"}</p>
          <p><strong>Gift Code:</strong> <span style="font-weight:bold; color:#D4AF37;">${code}</span></p>
          <p><strong>Sender:</strong> ${senderName}</p>
          <p><strong>Message:</strong> ${message || "No message provided"}</p>
          <p>Please check your dashboard for details and contact the recipient if needed.</p>
          <p>Thank you,<br/>Wanaw Team</p>
        </div>
      `;
      const providerText = `
New gift assigned for your service: ${service.title}
Recipient: ${recipient.name || "N/A"}
Gift Code: ${code}
Sender: ${senderName}
Message: ${message || "No message provided"}

Please check your dashboard for details.
`;

      try {
        await sendGiftEmail({ to: service.providerId.email, subject: providerSubject, html: providerHtml, text: providerText });
      } catch (providerEmailErr) {
        console.error("❌ Failed to send notification email to provider:", providerEmailErr);
      }
    }

    return res.status(200).json({
      msg: recipientEmailSent ? "Gift code assigned and email sent" : "Gift code assigned (email not sent to recipient)",
      code
    });

  } catch (err) {
    console.error("❌ Error assigning gift code:", err);
    return res.status(500).json({ msg: "Server error while assigning gift code" });
  }
};

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

// Get all gift codes with filters and populated service/provider


exports.getAllGiftCodes = async (req, res) => {
  try {
    const { status, providerName, dateFrom, dateTo } = req.query;
    let filter = {};

    if (status) filter.deliveryStatus = status;
    if (providerName) filter.providerName = { $regex: providerName, $options: "i" };
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const codes = await GiftNotification.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "service", strictPopulate: false }) // <- strictPopulate false
      .populate({ path: "providerId", select: "name" });

    res.status(200).json(codes);
  } catch (err) {
    console.error("❌ Error fetching gift codes:", err);
    res.status(500).json({ msg: "Server error fetching gift codes" });
  }
};

// Get all gifts with their assigned gift codes + recipient info
exports.getAllGiftsWithCodes = async (req, res) => {
  try {
    const { status, providerName, dateFrom, dateTo } = req.query;

    const filter = {};
    if (status) filter.deliveryStatus = status;
    if (providerName) filter.providerName = { $regex: providerName, $options: "i" };
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Fetch notifications and populate giftId and senderId
    const notifications = await GiftNotification.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "service", select: "title category" })
      .populate({ path: "giftId", select: "occasion senderName" }) // Gift info
      .populate({ path: "senderId", select: "name" }); // Sender info

    const gifts = notifications.map((notif) => ({
      _id: notif._id,
      // Use senderName from GiftNotification first, fallback to populated senderId.name
      senderName: notif.senderName || notif.senderId?.name || "Unknown",
      // Use occasion from giftId
      occasion: notif.giftId?.occasion || "Not specified",
      giftCode: notif.giftCode,
      deliveryStatus: notif.deliveryStatus,
      recipient: {
        name: notif.recipient?.name || "N/A",
        email: notif.recipient?.email || "",
        phone: notif.recipient?.phone || "",
        whatsapp: notif.recipient?.whatsapp || "",
        telegram: notif.recipient?.telegram || "",
      },
      service: notif.service
        ? {
          title: notif.service.title,
          category: notif.service.category,
        }
        : undefined,
    }));

    res.status(200).json(gifts);
  } catch (err) {
    console.error("❌ Error fetching gifts with codes:", err);
    res.status(500).json({ msg: "Server error fetching gifts with codes" });
  }
};

exports.getGiftsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ msg: "Invalid serviceId" });
    }

    // Fetch gifts for the service
    const gifts = await Gift.find({ service: serviceId })
      .populate("service", "title category")
      .populate("recipient", "name email phone")
      .sort({ createdAt: -1 });

    // Fetch gift codes from GiftNotification
    const giftIds = gifts.map(g => g._id);
    const notifications = await GiftNotification.find({ giftId: { $in: giftIds } });

    // Map gift codes to gifts
    const giftsWithCodes = gifts.map(g => {
      const notification = notifications.find(n => n.giftId.toString() === g._id.toString());
      return {
        ...g.toObject(),
        giftCode: notification ? notification.giftCode : "generating",
      };
    });

    res.status(200).json(giftsWithCodes);
  } catch (err) {
    console.error("❌ Error fetching service gifts:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
