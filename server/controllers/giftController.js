const sendGiftEmail = require("../services/emailService");

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
    <p style="margin-top:20px;">Visit Wanaw to explore more!</p>
  `;
  const text = `You’ve been gifted: ${service.title}\nMessage: ${message}`;

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
  const { title, category, occasion, description } = req.body;
  const imageFile = req.file;

  if (!title || !category) {
    return res.status(400).json({ msg: "Title and category are required" });
  }

  try {
    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : "";

    const newGift = new Gift({
      title,
      category,
      occasion,
      description,
      imageUrl,
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
