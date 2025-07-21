const Service = require("../models/Service");
const User = require("../models/User");

// controller/serviceController.js
const { sendEmail, sendSMS, sendTelegram } = require("../utils/notification");

exports.purchaseService = async (req, res) => {
  try {
    // Get buyer info and deliveryDate from request body
    const { buyerName, buyerEmail, deliveryDate } = req.body;

    if (!buyerName || !buyerEmail) {
      return res.status(400).json({ msg: "Buyer name and email are required" });
    }

    const service = await Service.findById(req.params.id).populate("providerId");
    if (!service) return res.status(404).json({ msg: "Service not found" });

    const provider = service.providerId;

    // Prepare a formatted date string if deliveryDate is provided
    let deliveryDateString = "";
    if (deliveryDate) {
      const d = new Date(deliveryDate);
      if (!isNaN(d)) {
        deliveryDateString = d.toLocaleString();  // readable format
      }
    }

    // Send notifications to provider with buyer info and delivery date
    await sendEmail({
      to: provider.email || process.env.NOTIFY_EMAIL,
      subject: `🎉 New Service Purchased: ${service.title}`,
      html: `
        <p><strong>Service:</strong> ${service.title}</p>
        <p><strong>Price:</strong> $${service.price}</p>
        <p><strong>Buyer:</strong> ${buyerName} (${buyerEmail})</p>
        ${deliveryDateString ? `<p><strong>Delivery Date:</strong> ${deliveryDateString}</p>` : ""}
        <p>Login to view the request and follow up.</p>
        <p>— Wanaw</p>
      `,
    });

    // You can also save deliveryDate to DB here if you have a purchase/order model

    res.json({ msg: "Service purchased. Notifications sent." });
  } catch (err) {
    console.error("Purchase error:", err.message);
    res.status(500).json({ msg: "Purchase failed." });
  }
};



// Normalize category helper
const normalizeCategory = (input) => {
  if (!input) return null;
  const c = input.trim().toLowerCase();

  if (["wellness", "spa", "wellness & spa"].includes(c)) return "Wellness";
  if (["medical", "health"].includes(c)) return "Medical";
  if (["home based services", "home-based", "home services", "home based/mobile"].includes(c)) return "Home Based/Mobile Services";

  if (["hotel", "hotel rooms", "rooms"].includes(c)) return "Hotel Rooms";

  return null; // Invalid category
};


exports.createService = async (req, res) => {
  const user = req.user;

  // ✅ Allow only provider or admin
  if (!["provider", "admin"].includes(user.role)) {
    return res
      .status(403)
      .json({ msg: "Only providers or admins can add services" });
  }

  const allowedMemberships = ["basic", "premium", "enterprise"];
  const limits = {
    basic: 3,
    premium: 10,
    enterprise: 50,
  };

  try {
    // ✅ Check membership limits only for providers
    if (user.role === "provider") {
      if (!allowedMemberships.includes(user.membership)) {
        return res
          .status(403)
          .json({ msg: "Upgrade membership to add services" });
      }

      const existingCount = await Service.countDocuments({
        providerId: user._id,
      });

      if (existingCount >= limits[user.membership]) {
        return res.status(403).json({
          msg: `Limit reached for ${user.membership} membership. Upgrade to add more services.`,
        });
      }
    }

    // ✅ Normalize and validate category
    const normalizedCategory = normalizeCategory(req.body.category);
    if (!normalizedCategory) {
      return res
        .status(400)
        .json({ msg: "Invalid or missing category" });
    }

    const imageUrl = req.body.imageUrl || "";



    const { title, description, price, location, subcategory } = req.body;

    const service = await Service.create({
      title,
      description,
      price,
      location,
      category: normalizedCategory,
      subcategory, // ✅ Explicitly saved
      imageUrl,
      providerId: user._id,
    });


    res
      .status(201)
      .json({ msg: "Service created successfully", service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create service" });
  }
};


exports.getAllServices = async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const filter = { isActive: true };

    // Normalize and apply category filter if present
    if (category) {
      const normalizedCategory = normalizeCategory(category);
      if (normalizedCategory) {
        filter.category = normalizedCategory;
      }
    }

    // Apply subcategory filter if present
    if (subcategory) {
      filter.subcategory = { $regex: subcategory, $options: "i" };
    }

    const services = await Service.find(filter).populate("providerId", "fullName");
    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching services" });
  }
};


exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("providerId", "fullName");
    if (!service) return res.status(404).json({ msg: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: "Service deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting service" });
  }
};

exports.updateServiceStatus = async (req, res) => {
  const { status } = req.body;

  if (!["approved", "denied"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status. Must be 'approved' or 'denied'" });
  }

  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    service.status = status;
    await service.save();

    res.json({ msg: `Service ${status}`, service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update service status" });
  }
};


