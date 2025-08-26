const Gift = require('../models/Gift');
const Service = require('../models/Service');
const mongoose = require("mongoose");

/* ─────────────────────────────
   Create Gift (no email/notification)
───────────────────────────── */
exports.createGift = async (req, res) => {
  try {
    const {
      title,
      category,
      occasion,
      description,
      imageUrl,
      senderName, // optional
      recipient,  // { name, email, phone, whatsapp, telegram }
      serviceId
    } = req.body;

    const user = req.user;
    const allowedRoles = ["admin", "super_admin", "marketing_admin"];
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (!title || !category || !recipient || (!recipient.email && !recipient.phone)) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Check service exists
    let service;
    if (serviceId) {
      service = await Service.findById(serviceId).populate("providerId", "fullName email");
      if (!service) return res.status(404).json({ msg: "Service not found" });
    }

    // Generate 4-digit gift code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Save gift
    const newGift = new Gift({
      title,
      category,
      occasion,
      description,
      imageUrl: imageUrl || "",
      senderName: senderName || user.name || "Admin",
      recipient,
      service: serviceId,
      providerId: user._id,
    });
    await newGift.save();

    res.status(201).json({
      msg: "✅ Gift created successfully",
      gift: newGift,
      giftCode: code, // return generated code to frontend
    });

  } catch (err) {
    console.error("❌ Error creating gift:", err);
    res.status(500).json({ msg: "Failed to create gift", error: err.message });
  }
};


/* ─────────────────────────────
   Confirm Gift Code
───────────────────────────── */
exports.confirmGiftCode = async (req, res) => {
  try {
    const { giftId } = req.params;
    const { code } = req.body;

    if (!giftId || !code) {
      return res.status(400).json({ msg: "Gift ID and code are required" });
    }

    const notification = await GiftNotification.findOne({ giftId, giftCode: code });
    if (!notification) return res.status(400).json({ msg: "Invalid gift code or gift ID" });

    if (notification.deliveryStatus === "delivered") {
      return res.status(200).json({
        msg: "Gift already confirmed",
        status: "delivered",
        service: notification.service,
        recipient: notification.recipient,
      });
    }

    notification.deliveryStatus = "delivered";
    notification.deliveredAt = new Date();
    await notification.save();

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

/* ─────────────────────────────
   Fetch Gifts / Gift Codes
───────────────────────────── */
exports.getGiftsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) return res.status(400).json({ msg: "Invalid serviceId" });

    const gifts = await Gift.find({ service: serviceId })
      .populate("service", "title category")
      .populate("recipient", "name email phone")
      .sort({ createdAt: -1 });

    const giftIds = gifts.map(g => g._id);
    const notifications = await GiftNotification.find({ giftId: { $in: giftIds } });

    const giftsWithCodes = gifts.map(g => {
      const notification = notifications.find(n => n.giftId.toString() === g._id.toString());
      return { ...g.toObject(), giftCode: notification ? notification.giftCode : "generating" };
    });

    res.status(200).json(giftsWithCodes);
  } catch (err) {
    console.error("❌ Error fetching service gifts:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllGiftCodes = async (req, res) => {
  try {
    const { status, providerName, dateFrom, dateTo } = req.query;
    const filter = {};

    if (status) filter.deliveryStatus = status;
    if (providerName) filter.providerName = { $regex: providerName, $options: "i" };
    if (dateFrom || dateTo) filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);

    const codes = await GiftNotification.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "service", strictPopulate: false })
      .populate({ path: "providerId", select: "name" });

    res.status(200).json(codes);
  } catch (err) {
    console.error("❌ Error fetching gift codes:", err);
    res.status(500).json({ msg: "Server error fetching gift codes" });
  }
};

exports.getAllGiftsWithCodes = async (req, res) => {
  try {
    const { status, providerName, dateFrom, dateTo } = req.query;
    const filter = {};
    if (status) filter.deliveryStatus = status;
    if (providerName) filter.providerName = { $regex: providerName, $options: "i" };
    if (dateFrom || dateTo) filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);

    const notifications = await GiftNotification.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "service", select: "title category" })
      .populate({ path: "giftId", select: "occasion senderName" })
      .populate({ path: "senderId", select: "name" });

    const gifts = notifications.map((notif) => ({
      _id: notif._id,
      senderName: notif.senderName || notif.senderId?.name || "Unknown",
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
        ? { title: notif.service.title, category: notif.service.category }
        : undefined,
    }));

    res.status(200).json(gifts);
  } catch (err) {
    console.error("❌ Error fetching gifts with codes:", err);
    res.status(500).json({ msg: "Server error fetching gifts with codes" });
  }
};

/* ─────────────────────────────
   Delete Gift
───────────────────────────── */
exports.deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    if (!gift) return res.status(404).json({ msg: "Gift not found" });
    res.status(200).json({ msg: "Gift deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete gift" });
  }
};
/* ─────────────────────────────
   Fetch All Gifts
───────────────────────────── */
exports.getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find()
      .populate("service", "title category")
      .populate("recipient", "name email phone whatsapp telegram")
      .sort({ createdAt: -1 });

    res.status(200).json(gifts);
  } catch (err) {
    console.error("❌ Error fetching all gifts:", err);
    res.status(500).json({ msg: "Server error fetching all gifts" });
  }
};

