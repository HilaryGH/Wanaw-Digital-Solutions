const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../utils/notification"); // adjust path if needed

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already subscribed" });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send welcome email
    sendEmail({
      to: email,
      subject: "Welcome to Wanaw Health and Wellness Digital Solution!",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
      <h1 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Digital Solution</h1>
    </div>
    <div style="padding: 30px; background-color: #fff;">
      <h2 style="color: #1c2b21; margin-top: 0;">Welcome to Wanaw!</h2>

      <p style="font-size: 16px; color: #333;">
        Thank you for subscribing to <strong>Wanaw Health and Wellness Digital Solution</strong>. We're delighted to have you in our growing community.
      </p>

      <p style="font-size: 16px; color: #333;">
        As a subscriber, you’ll receive:
      </p>

      <ul style="font-size: 16px; color: #333; padding-left: 20px; margin-top: 0;">
        <li>Holistic health & wellness insights</li>
        <li>Exclusive care packages & offers</li>
        <li>Curated gift ideas for all occasions</li>
        <li>Opportunities to connect with trusted service providers</li>
      </ul>

      <p style="font-size: 16px; color: #333;">
        Whether you're treating yourself or someone you love, Wanaw makes it easier to care intentionally and meaningfully.
      </p>

      <p style="font-size: 16px; color: #333;">
        We’re here to support your wellness journey. Just reply to this email anytime — we’d love to hear from you!
      </p>

      <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
        With warmth,<br/>
        <strong>The Wanaw Team</strong>
      </p>

      <a href="https://wanawhealthandwellness.netlify.app/" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #1c2b21; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Explore Wanaw
      </a>
    </div>
    <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color:#D4AF37;">
      &copy; ${new Date().getFullYear()} Wanaw Health and Wellness Digital Solution. All rights reserved.
    </div>
  </div>
`
    });

    console.log("New subscriber saved and email sent:", email);
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error saving subscriber or sending email:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

