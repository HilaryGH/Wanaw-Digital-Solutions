const Purchase = require("../models/Purchase");
const GiftNotification = require("../models/GiftNotification");
const Service = require("../models/Service");
const Gift = require("../models/Gift");
const sendGiftEmail = require("../services/emailService");
const { sendMultiChannel } = require("../utils/notification");

/**
 * Get all purchases (services + gifts) for a provider including gift notifications
 */
exports.getProviderPurchases = async (req, res) => {
  try {
    const { providerId } = req.params;

    // 1️⃣ Fetch all purchases for this provider, including provider info
    const purchases = await Purchase.find({ providerId })
      .populate("providerId", "fullName email phone") // provider info
      .sort({ purchaseDate: -1 })
      .lean();

    if (!purchases.length) return res.json([]);

    // 2️⃣ Extract item IDs by type to populate correctly
    const serviceIds = purchases
      .filter((p) => p.itemType?.toLowerCase() === "service")
      .map((p) => p.itemId);

    const giftIds = purchases
      .filter((p) => p.itemType?.toLowerCase() === "gift")
      .map((p) => p.itemId);

    // 3️⃣ Fetch all items
    const services = await Service.find({ _id: { $in: serviceIds } }).lean();
    const gifts = await Gift.find({ _id: { $in: giftIds } }).lean();

    // 4️⃣ Map items for quick lookup
    const serviceMap = Object.fromEntries(services.map((s) => [s._id.toString(), s]));
    const giftMap = Object.fromEntries(gifts.map((g) => [g._id.toString(), g]));

    // 5️⃣ Extract purchase IDs for gift notifications
    const purchaseIds = purchases.map((p) => p._id);
    const notifications = await GiftNotification.find({
      purchaseId: { $in: purchaseIds },
    }).lean();

    // 6️⃣ Merge item & gift info into each purchase
    const result = purchases.map((p) => {
      const relatedGifts = notifications
        .filter((n) => n.purchaseId.toString() === p._id.toString())
        .map((n) => ({
          giftCode: n.giftCode,
          recipient: n.recipient || { name: "N/A", email: "N/A", phone: "N/A" },
          deliveryStatus: n.deliveryStatus || "pending",
          occasion: n.occasion || "Not specified",
        }));

      // Item details
      let itemDetails = null;
      if (p.itemType?.toLowerCase() === "service" && serviceMap[p.itemId]) {
        const s = serviceMap[p.itemId];
        itemDetails = {
          id: s._id,
          title: s.title,
          category: s.category,
          location: s.location,
          price: s.price,
        };
      } else if (p.itemType?.toLowerCase() === "gift" && giftMap[p.itemId]) {
        const g = giftMap[p.itemId];
        itemDetails = {
          id: g._id,
          title: g.title,
          category: g.category,
          price: g.price,
        };
      }

      return {
        id: p._id,
        itemType: p.itemType,
        item: itemDetails,
        provider: p.providerId
          ? {
            id: p.providerId._id,
            fullName: p.providerId.fullName,
            email: p.providerId.email,
            phone: p.providerId.phone || "N/A",
          }
          : null,
        buyerName: p.buyerName,
        buyerEmail: p.buyerEmail,
        amount: p.amount,
        purchaseDate: p.purchaseDate,
        deliveryDate: p.deliveryDate,
        gifts: relatedGifts,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching provider purchases:", err);
    res.status(500).json({
      msg: "Failed to fetch provider purchases.",
      error: err.message,
    });
  }
};





/* ─────────────────────────────
   Update Gift Status + Notify Recipient
───────────────────────────── */
/* ─────────────────────────────
   Update Gift Status + Notify Recipient via Multiple Channels
───────────────────────────── */
exports.updateGiftStatus = async (req, res) => {
  try {
    const { giftCode, newStatus } = req.body;

    if (!giftCode || !newStatus) {
      return res.status(400).json({ msg: "giftCode and newStatus are required" });
    }

    const status = newStatus.toLowerCase();
    const allowedStatuses = ["pending", "delivered", "canceled"];

    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ msg: `Invalid status. Allowed: ${allowedStatuses.join(", ")}` });
    }

    // Find the gift notification
    const gift = await GiftNotification.findOne({ giftCode });
    if (!gift) return res.status(404).json({ msg: "Gift not found" });

    // Update status
    gift.deliveryStatus = status;
    if (status === "delivered") gift.deliveredAt = new Date();
    await gift.save();

    // Prepare notification content
    const subject = `🎁 Gift Status Update: Your gift is now ${status}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
          <h2 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Digital Solution</h2>
        </div>
        <div style="padding: 30px; background-color: #fff; color: #333;">
          <p>Hello ${gift.recipient.name || "there"},</p>
          <p>The status of your gift with code <strong>${giftCode}</strong> has been updated to <strong>${status}</strong>.</p>
          <p>Enjoy your experience!</p>
          <div style="text-align:center; margin-top: 25px;">
            <a href="https://wanawhealthandwellness.netlify.app/" style="display:inline-block; padding:12px 24px; background-color:#D4AF37; color:#1c2b21; text-decoration:none; border-radius:4px; font-weight:bold;">
              Redeem Your Gift
            </a>
          </div>
        </div>
        <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color: #D4AF37;">
          &copy; ${new Date().getFullYear()} Wanaw Health & Wellness. All rights reserved.
        </div>
      </div>
    `;
    const text = `Hello ${gift.recipient.name || "there"}!
Gift code ${giftCode} status is now: ${status}
Redeem at: https://wanawhealthandwellness.netlify.app/`;

    // ✅ Send multi-channel notification
    await sendMultiChannel({
      email: gift.recipient.email,
      phone: gift.recipient.phone,
      whatsapp: gift.recipient.whatsapp,
      telegram: gift.recipient.telegram,
      subject,
      html,
      text,
    });

    res.status(200).json({
      msg: `✅ Gift status updated to ${status} and recipient notified via all available channels`,
      giftCode,
      deliveryStatus: status,
    });
  } catch (err) {
    console.error("❌ Error updating gift status:", err);
    res.status(500).json({ msg: "Failed to update gift status", error: err.message });
  }
};