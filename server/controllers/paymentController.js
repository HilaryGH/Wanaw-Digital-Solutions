// controllers/paymentController.js
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Service = require("../models/Service");
const { sendEmail, sendSMS, sendWhatsApp } = require("../utils/notification");
// const GiftBatch = require("../models/GiftBatch");   // if you store batches

const CHAPA_KEY = process.env.CHAPA_SECRET_KEY; // keep it in .env

/* ────────────────────────────────────────────────────── */
/*  1. SINGLE‑GIFT CHECKOUT                              */
/* ────────────────────────────────────────────────────── */
exports.initiateChapaPaymentSingle = async (req, res) => {
  try {
    const {
      amount,
      email,
      phone_number,
      whatsapp_number,
      first_name,
      last_name,
      serviceId,
      occasionId,
      notifyProvider = false,
      providerMessage = "",
      providerContact = null,
    } = req.body;

    if (!amount || !serviceId) {
      return res.status(400).json({ error: "Missing amount or serviceId" });
    }

    /* Optional service lookup (for webhook metadata) */
    let serviceTitle = "";
    try {
      const s = await Service.findById(serviceId);
      serviceTitle = s ? s.title : "";
    } catch (_) { }

    /* Build Chapa body */
    const tx_ref = uuidv4();
    const chapaBody = {
      amount,
      currency: "ETB",
      email,                      // could be blank
      first_name,
      last_name,
      tx_ref,
      callback_url: `${process.env.BASE_URL}/payment/verify/${tx_ref}`,
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      meta: {
        serviceId,
        serviceTitle,
        occasionId,
        notifyProvider,
        providerMessage,
        providerContact,
        emails: email ? [email] : [],
        phones: phone_number ? [phone_number] : [],
        whatsapps: whatsapp_number ? [whatsapp_number] : [],
      },
    };

    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaBody,
      { headers: { Authorization: `Bearer ${CHAPA_KEY}` } }
    );

    const { checkout_url } = chapaRes.data.data || {};
    if (!checkout_url) {
      return res.status(500).json({ error: "Chapa init failed" });
    }

    /* 🗂️  (Optional) save a GiftBatch / temp record here */

    return res.json({ checkout_url });
  } catch (err) {
    console.error("Chapa single init error:", err.response?.data || err);
    res.status(500).json({ error: "Server error initiating payment" });
  }
};

/* ────────────────────────────────────────────────────── */
/*  2. BULK (MULTI‑GIFT) CHECKOUT                         */
/*     Expects: { gifts: [ { amount, email, phone_number, ... } ] } */
/* ────────────────────────────────────────────────────── */
exports.initiateChapaPaymentBulk = async (req, res) => {
  try {
    const { gifts } = req.body;
    if (!Array.isArray(gifts) || gifts.length === 0) {
      return res.status(400).json({ error: "gifts array required" });
    }

    /* Prepare an array of parallel Chapa requests */
    const results = await Promise.all(
      gifts.map(async (gift) => {
        const {
          amount,
          email,
          phone_number,
          whatsapp_number,
          first_name,
          last_name,
          serviceId,
          occasionId,
          notifyProvider = false,
          providerMessage = "",
          providerContact = null,
        } = gift;

        if (!amount || !serviceId) {
          throw new Error("Each gift must include amount and serviceId");
        }

        /* Service title for metadata */
        let serviceTitle = "";
        try {
          const s = await Service.findById(serviceId);
          serviceTitle = s ? s.title : "";
        } catch (_) { }

        const tx_ref = uuidv4();
        const chapaBody = {
          amount,
          currency: "ETB",
          email,
          first_name,
          last_name,
          tx_ref,
          callback_url: `${process.env.BASE_URL}/api/payment/verify/${tx_ref}`,
          return_url: `${process.env.FRONTEND_URL}/payment-success`,

          meta: {
            serviceId,
            serviceTitle,
            occasionId,
            notifyProvider,
            providerMessage,
            providerContact,
            emails: email ? [email] : [],
            phones: phone_number ? [phone_number] : [],
            whatsapps: whatsapp_number ? [whatsapp_number] : [],
          },
        };

        const chapaRes = await axios.post(
          "https://api.chapa.co/v1/transaction/initialize",
          chapaBody,
          { headers: { Authorization: `Bearer ${CHAPA_KEY}` } }
        );

        const checkout_url = chapaRes.data?.data?.checkout_url || null;
        return { tx_ref, checkout_url };
      })
    );

    /* You might want to persist the batch here (GiftBatch) */

    /* Return an array so the frontend can show N checkout links or open the first one */
    return res.json({ batch: results });
  } catch (err) {
    console.error("Chapa bulk init error:", err.response?.data || err);
    res.status(500).json({ error: "Server error initiating bulk payment" });
  }
};

/* ────────────────────────────────────────────────────── */
/*  3. CHAPA WEBHOOK (unchanged)                          */
/* ────────────────────────────────────────────────────── */
exports.chapaWebhook = async (req, res) => {
  const { tx_ref, status } = req.body;
  res.sendStatus(200); // ACK quickly

  if (status !== "success") return; // ignore failures

  try {
    const {
      emails = [],
      phones = [],
      whatsapps = [],
      serviceId,
      serviceTitle,
      senderName,
      message,
    } = req.body.metadata || {};

    const notifyText = `🎁 You’ve received the gift “${serviceTitle}” from ${senderName || "a friend"
      }.\n${message || ""}`;

    /* A. Notify recipients */
    await Promise.all([
      ...emails.map((e) => sendEmail(e, "You've received a gift!", notifyText)),
      ...phones.map((p) => sendSMS(p, notifyText)),
      ...whatsapps.map((w) => sendWhatsApp(w, notifyText)),
    ]);

    /* B. Notify service provider */
    if (serviceId) {
      const service = await Service.findById(serviceId).populate(
        "providerId",
        "companyName email phone whatsapp"
      );

      if (service?.providerId) {
        const provider = service.providerId;
        const providerMsg = `Hello ${provider.companyName || "provider"
          }, a customer has purchased your service “${service.title
          }” as a gift on Wanaw.`;

        if (provider.email)
          await sendEmail(
            provider.email,
            "New gift purchase on Wanaw",
            providerMsg
          );
        if (provider.phone) await sendSMS(provider.phone, providerMsg);
        if (provider.whatsapp)
          await sendWhatsApp(provider.whatsapp, providerMsg);
      }
    }

    console.log(`✅ Notifications sent for payment ${tx_ref}`);
  } catch (err) {
    console.error("Notification error:", err);
  }
};

