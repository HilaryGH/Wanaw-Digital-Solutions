const Purchase = require("../models/Purchase");

exports.getProviderPurchases = async (req, res) => {
  try {
    const { providerId } = req.params;

    const purchases = await Purchase.find({ providerId })
      .populate("itemId") // populates gift or service info
      .sort({ purchaseDate: -1 });

    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch purchases." });
  }
};
