const Service = require("../models/Service");
const Purchase = require("../models/Purchase");
const GiftNotification = require("../models/GiftNotification");
const { notifyProviderOfPurchase } = require("../controllers/notificationController");
const sendGiftEmail = require("../services/emailService");
const Gift = require("../models/Gift");


/* ─────────────────────────────
   Purchase a Service + Send Gift Notifications
───────────────────────────── */
exports.purchaseService = async (req, res) => {
  try {
    // ✅ ensure req.body is at least an empty object
    const body = req.body || {};

    let { buyerName, buyerEmail, message, deliveryDate } = body;
    let recipients = [];

    if (req.body.recipients) {
      try {
        if (typeof req.body.recipients === "string") {
          recipients = JSON.parse(req.body.recipients); // parse string
        } else {
          recipients = req.body.recipients; // already an object/array
        }
      } catch (err) {
        console.error("❌ Invalid recipients JSON:", err.message);
        return res.status(400).json({ error: "Invalid recipients format" });
      }
    }


    // Validation
    if (!buyerName || !buyerEmail) {
      return res.status(400).json({ msg: "Buyer name and email are required" });
    }
    if (!recipients.length) {
      return res.status(400).json({ msg: "At least one recipient is required" });
    }

    // ⬇️ Handle uploaded VIP photos here
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/recipients\[(\d+)\]\[photo\]/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (recipients[index]) {
            // store filename or path in recipient
            recipients[index].photo = file.filename || file.originalname;
          }
        }
      });
    }
    // Find service and populate the provider's fullName and email
    const service = await Service.findById(req.params.id)
      .populate("providerId", "fullName email");

    if (!service) return res.status(404).json({ msg: "Service not found" });

    const gift = await Gift.findOne({ service: service._id });
    if (!gift) {
      console.warn("No gift associated with this service");
    }
    const giftId = gift ? gift._id : null;  // safe fallback


    // Save purchase record
    const purchase = await Purchase.create({
      itemType: "Service", // capital S
      itemId: service._id,
      providerId: service.providerId._id,
      buyerName,
      buyerEmail,
      amount: (service.price || 0) * recipients.length,
      deliveryDate,
      message,
      recipients, // save full list
    });

    // Generate gift codes + create notifications
    const codes = [];
    for (const recipient of recipients) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      codes.push(code);

      // ⬇️ attach code to recipient object
      recipient.giftCode = code;

      await GiftNotification.create({
        purchaseId: purchase._id,
        giftCode: code,
        recipient,
        giftId: gift ? gift._id : null, // <--- link Gift here         // safe
        occasion: gift ? gift.occasion : "Not specified", // include occasion safely
        deliveryStatus: "pending",
        providerId: service.providerId?._id,
        providerName: service.providerId?.fullName,
        service: service._id,
        serviceLocation: service.location || "N/A",
      });
      // ⬇️ attach code to recipient object
      recipient.giftCode = code;
      // Send email to recipient immediately (optional)
      if (recipient.email) {
        try {
          // inside purchaseService loop -> replacing sendGiftEmail({ ... })

          await sendGiftEmail({
            to: recipient.email,
            subject: `🎁 You've received a gift from ${buyerName}`,
            html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <!-- Header -->
    <div style="background-color:#1c2b21; padding: 20px; text-align: center;">
      <h2 style="margin: 0; color: #D4AF37;">Wanaw Health and Wellness Digital Solution</h2>
    </div>

    <!-- Body -->
    <div style="padding: 30px; background-color: #fff; color: #333;">
      <p style="font-size: 16px;">Hello ${recipient.name || "there"},</p>

      <p style="font-size: 16px;">
        <strong>${buyerName}</strong> has sent you a special gift through <strong>Wanaw Health & Wellness</strong>!
      </p>

      <ul style="font-size: 16px; padding-left: 20px;">
        <li><strong>Service:</strong> ${service.title}</li>
        <li><strong>Gift Code:</strong> <span style="color:#D4AF37; font-weight:bold;">${code}</span></li>
        <li><strong>Provider:</strong> ${service.providerId?.fullName || "N/A"}</li>
        <li><strong>Location:</strong> ${service.location || "N/A"}</li>
      </ul>

      ${message ? `<p style="font-size: 16px; margin-top: 15px;"><em>"${message}"</em></p>` : ""}

      <p style="font-size: 16px; margin-top: 20px;">
        Enjoy your experience — you've earned it!
      </p>

      <!-- CTA Button -->
      <div style="text-align:center; margin-top: 25px;">
        <a href="https://wanawhealthandwellness.netlify.app/" 
          style="display:inline-block; padding:12px 24px; background-color:#D4AF37; color:#1c2b21; 
                 text-decoration:none; border-radius:4px; font-weight:bold;">
          Redeem Your Gift
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1c2b21; padding: 15px; text-align: center; font-size: 13px; color: #D4AF37;">
      &copy; ${new Date().getFullYear()} Wanaw Health & Wellness. All rights reserved.
    </div>
  </div>
  `,
            text: `Hello ${recipient.name || "there"}!
From: ${buyerName}
Service: ${service.title}
Gift Code: ${code}
Message: ${message || "No message provided"}
Redeem at: https://wanawhealthandwellness.netlify.app/`,
          });

        } catch (err) {
          console.error("❌ Failed to send gift email:", err);
        }
      }
    }

    // Notify provider
    await notifyProviderOfPurchase(service, { buyerName, buyerEmail }, deliveryDate);

    res.status(201).json({
      msg: "✅ Purchase recorded, recipients notified",
      purchase,
      codes, // array of gift codes (frontend expects this)
    });
  } catch (err) {
    console.error("❌ Purchase error:", err);
    res.status(500).json({ msg: "Purchase failed", error: err.message });
  }
};


/* ─────────────────────────────
   Category Normalizer
───────────────────────────── */
const normalizeCategory = (input) => {
  if (!input) return null;

  const c = input.trim().toLowerCase();

  if (c === "wellness" || c.includes("nutrition")) return "Wellness";
  if (c === "medical" || c.includes("diagnostic")) return "Medical";
  if (c === "home based services" || c === "home-based services" || c === "home services")
    return "Home Based/Mobile Services";
  if (c === "hotel" || c === "hotel rooms") return "Hotel";

  return null; // Invalid category
};

/* ─────────────────────────────
   Create Service
───────────────────────────── */
exports.createService = async (req, res) => {
  const user = req.user;

  if (!["provider", "super_admin", "admin"].includes(user.role)) {
    return res.status(403).json({ msg: "Only providers or admins can add services" });
  }

  // Membership mapping
  const allowedMemberships = ["Basic Provider", "Premium Provider"];
  const limits = {
    "Basic Provider": 3,
    "Premium Provider": 10,
    Super: 50, // admins not limited
  };

  try {
    if (user.role === "provider") {
      if (!allowedMemberships.includes(user.membership)) {
        return res.status(403).json({ msg: "Upgrade membership to add services" });
      }

      const existingCount = await Service.countDocuments({ providerId: user._id });
      if (existingCount >= limits[user.membership]) {
        return res.status(403).json({
          msg: `Limit reached for ${user.membership}. Upgrade to add more services.`,
        });
      }
    }

    // Normalize category
    const normalizedCategory = normalizeCategory(req.body.category);
    if (!normalizedCategory) {
      return res.status(400).json({ msg: "Invalid or missing category" });
    }

    // Handle images (either from Cloudinary or form body)
    let imageUrl = "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const { title, description, price, location, subcategory } = req.body;

    const service = await Service.create({
      title,
      description,
      price,
      location,
      category: normalizedCategory,
      subcategory,
      imageUrl,
      providerId: user._id,
    });

    res.status(201).json({ msg: "✅ Service created successfully", service });
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ msg: "Failed to create service" });
  }
};

/* ─────────────────────────────
   Get All Services
───────────────────────────── */
exports.getAllServices = async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const filter = { isActive: true };

    if (category) {
      const normalizedCategory = normalizeCategory(category);
      if (normalizedCategory) filter.category = normalizedCategory;
    }

    if (subcategory) {
      filter.subcategory = { $regex: subcategory, $options: "i" };
    }

    const services = await Service.find(filter).populate("providerId", "fullName email");
    res.status(200).json(services);
  } catch (err) {
    console.error("Fetch services error:", err);
    res.status(500).json({ msg: "Error fetching services" });
  }
};

/* ─────────────────────────────
   Get Service by ID
───────────────────────────── */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("providerId", "fullName email");
    if (!service) return res.status(404).json({ msg: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    console.error("Get service error:", err);
    res.status(500).json({ msg: "Error fetching service" });
  }
};

/* ─────────────────────────────
   Delete Service
───────────────────────────── */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: "🗑️ Service deleted" });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ msg: "Error deleting service" });
  }
};

/* ─────────────────────────────
   Update Service Status
───────────────────────────── */
exports.updateServiceStatus = async (req, res) => {
  const { status, checkInDate, checkOutDate, guests, roomPref } = req.body;

  if (!["approved", "denied"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status. Must be 'approved' or 'denied'" });
  }

  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    service.status = status;
    await service.save();

    if (service.category === "Hotel Rooms") {
      await HotelAvailability.create({
        serviceId: service._id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guests: guests || 1,
        roomPref: roomPref || "Any",
      });
    }

    res.json({ msg: `Service ${status}`, service });
  } catch (err) {
    console.error("Update service status error:", err);
    res.status(500).json({ msg: "Failed to update service status" });
  }
};
// Get all subcategories by category
exports.getSubcategories = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ msg: "Category is required" });
    }

    // Normalize category like in createService
    const normalizedCategory = normalizeCategory(category);
    if (!normalizedCategory) {
      return res.status(400).json({ msg: "Invalid category" });
    }

    // Get distinct subcategories
    const subcategories = await Service.distinct("subcategory", { category: normalizedCategory });

    res.json(subcategories.filter(Boolean)); // remove null/empty
  } catch (err) {
    console.error("Get subcategories error:", err);
    res.status(500).json({ msg: "Failed to fetch subcategories" });
  }
};


exports.getPurchases = async (req, res) => {
  try {
    // 1️⃣ Fetch purchases with item and provider info
    const purchases = await Purchase.find({ itemType: "Service" })
      .populate("itemId", "title category location providerId") // item info
      .populate("providerId", "fullName email") // provider info
      .lean();

    const purchaseIds = purchases.map(p => p._id);

    // 2️⃣ Fetch gift notifications and populate gift info
    const giftNotifications = await GiftNotification.find({ purchaseId: { $in: purchaseIds } })
      .populate({ path: "giftId", select: "occasion" }) // ensures occasion is populated
      .lean();

    // 3️⃣ Map purchases with gifts and provider info
    const result = purchases.map(purchase => {
      const gifts = giftNotifications.filter(
        g => g.purchaseId.toString() === purchase._id.toString()
      );

      return {
        id: purchase._id,
        itemType: purchase.itemType,
        service: purchase.itemId
          ? {
            id: purchase.itemId._id,
            title: purchase.itemId.title,
            category: purchase.itemId.category,
            location: purchase.itemId.location,
          }
          : null,
        provider: purchase.providerId
          ? {
            id: purchase.providerId._id,
            fullName: purchase.providerId.fullName,
            email: purchase.providerId.email,
          }
          : null,
        buyerName: purchase.buyerName,
        buyerEmail: purchase.buyerEmail,
        amount: purchase.amount,
        deliveryDate: purchase.deliveryDate,
        purchaseDate: purchase.purchaseDate,
        gifts: gifts.map(g => ({
          giftCode: g.giftCode,
          recipient: g.recipient,
          deliveryStatus: g.deliveryStatus,
          occasion: g.giftId?.occasion || "Not specified", // ✅ fix for occasion
        })),
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to fetch purchases:", err);
    res.status(500).json({ msg: "Failed to fetch purchases", error: err.message });
  }
};

