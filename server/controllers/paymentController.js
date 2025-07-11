const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.initiateChapaPayment = async (req, res) => {
  const {
    amount,
    email,
    first_name,
    last_name,
    phone_number,
    service,
    membershipPlan, // ✅ optional, if paying for a membership
  } = req.body;

  const tx_ref = "wanaw-" + uuidv4();

  const isMembership = !!membershipPlan;
  const planParam = isMembership ? `?plan=${membershipPlan}` : "";

  const data = {
    amount,
    currency: "ETB",
    email,
    first_name,
    last_name,
    phone_number,
    tx_ref,
    callback_url: `http://localhost:5173/payment-success${planParam}`,
    return_url: `http://localhost:5173/payment-success${planParam}`,
    customization: {
      title: isMembership ? "Wanaw Membership" : "Wanaw Gift",
      description: isMembership
        ? `Membership Plan: ${membershipPlan}`
        : service?.title || "A lovely gift via Wanaw",
    },
  };

  try {
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

    console.log("✅ Chapa Response:", chapaRes.data);
    res.status(200).json({ checkout_url: chapaRes.data.data.checkout_url });
  } catch (err) {
    console.error("❌ Chapa Init Error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Payment initialization failed" });
  }
};


