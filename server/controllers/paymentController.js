// controllers/paymentController.js
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { sendEmail, sendSMS, sendWhatsApp } = require("../utils/notification");
// const GiftBatch = require("../models/GiftBatch"); // ← create if you want persistence

/* ───────────── 1. INITIATE CHAPA BULK PAYMENT ───────────── */
exports.initiateChapaPaymentBulk = async (req, res) => {
  const {
    amount,            // price per service (Number)
    emails = [],       // ["a@mail.com", ...]
    phones = [],       // ["+2519....", ...]
    whatsapps = [],    // ["+2519....", ...]
    senderName,
    serviceId,
    occasionId,
  } = req.body;

  /* 1️⃣ Validate recipient list */
  const totalRecipients = emails.length + phones.length + whatsapps.length;
  if (totalRecipients === 0) {
    return res.status(400).json({
      msg: "At least one recipient (email / phone / WhatsApp) is required",
    });
  }

  /* 2️⃣ Compute amount & tx_ref */
  const totalAmount = amount * totalRecipients;
  const tx_ref = "wanaw-" + uuidv4();

  /* 3️⃣ Build Chapa payload */
  const payerEmail =
    emails[0] ||
    `${(senderName || "wanaw").replace(/\s+/g, "").toLowerCase()}@noemail.com`;

  const data = {
    amount: totalAmount.toString(),
    currency: "ETB",
    email: payerEmail,
    first_name: senderName || "Gift",
    last_name: "Sender",
    phone_number: phones[0] || "0910000000",
    tx_ref,
    callback_url: `${process.env.FRONTEND_URL}/payment-success?bulk=1&tx_ref=${tx_ref}`,
    return_url: `${process.env.FRONTEND_URL}/payment-success?bulk=1&tx_ref=${tx_ref}`,
    customization: {
      title: "Wanaw Bulk Gift",
      description: `Sending ${totalRecipients} gifts – Service ${serviceId}`,
    },
  };

  try {
    /* 4️⃣ Initialize Chapa transaction */
    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    /* 5️⃣ Optionally save batch for later webhook use */
    // await GiftBatch.create({
    //   tx_ref,
    //   emails,
    //   phones,
    //   whatsapps,
    //   totalAmount,
    //   serviceId,
    //   occasionId,
    // });

    res.status(200).json({
      checkout_url: chapaRes.data.data.checkout_url,
      tx_ref,
    });
  } catch (err) {
    console.error("❌ Chapa Init Error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Payment initialization failed" });
  }
};

/* ───────────── 2. CHAPA WEBHOOK HANDLER ─────────────
   Configure this URL in Chapa dashboard (e.g. /api/payment/webhook/chapa)
────────────────────────────────────────────────────── */
exports.chapaWebhook = async (req, res) => {
  /* Chapa sends POST with tx_ref and status === "success" */
  const { tx_ref, status } = req.body;

  // Always respond 200 quickly to acknowledge
  res.sendStatus(200);

  if (status !== "success") return;

  try {
    /* a. Retrieve saved batch (skip if not using DB) */
    // const batch = await GiftBatch.findOne({ tx_ref });
    // if (!batch) return console.warn("No GiftBatch for", tx_ref);

    /* b. If you skipped DB, parse recipients from hidden metadata (req.body.metadata) */
    // For demo I'll assume you stored recipients in metadata:
    const { emails = [], phones = [], whatsapps = [], serviceTitle, senderName, message } =
      req.body.metadata || {};

    const notifyText = `🎁 You’ve received the gift “${serviceTitle}” from ${senderName || "a friend"
      }.\n${message || ""}`;

    /* c. Send notifications */
    await Promise.all([
      ...emails.map((e) => sendEmail(e, "You've received a gift!", notifyText)),
      ...phones.map((p) => sendSMS(p, notifyText)),
      ...whatsapps.map((w) => sendWhatsApp(w, notifyText)),
    ]);

    console.log(`✅ Notifications sent for batch ${tx_ref}`);
  } catch (err) {
    console.error("Notification error:", err);
  }
};
