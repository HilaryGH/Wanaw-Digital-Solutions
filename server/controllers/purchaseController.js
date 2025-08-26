const Purchase = require("../models/Purchase");
const GiftNotification = require("../models/GiftNotification");
const Service = require("../models/Service");

exports.getProviderServicePurchases = async (req, res) => {
  try {
    const { providerId } = req.params;

    // ✅ Step 1: Fetch purchases for this provider
    const purchases = await Purchase.find({ providerId, itemType: "service" })
      .populate("itemId", "title price category location") // populate service details
      .sort({ purchaseDate: -1 })
      .lean();

    if (!purchases.length) {
      return res.json([]); // no purchases found
    }

    // ✅ Step 2: Extract purchaseIds as ObjectIds
    const purchaseIds = purchases.map((p) => p._id);

    // ✅ Step 3: Fetch gift notifications related to these purchases
    const notifications = await GiftNotification.find({
      purchaseId: { $in: purchaseIds },
    })
      .select("purchaseId giftCode")
      .lean();

    // Create a map for quick lookup
    const notificationMap = {};
    notifications.forEach((n) => {
      notificationMap[n.purchaseId.toString()] = n.giftCode;
    });

    // ✅ Step 4: Merge giftCode into each purchase
    const result = purchases.map((p) => ({
      ...p,
      giftCode: notificationMap[p._id.toString()] || "", // attach giftCode
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).json({
      msg: "Failed to fetch service purchases.",
      error: err.message,
    });
  }
};





