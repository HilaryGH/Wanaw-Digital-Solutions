const Service = require("../models/Service");
const User = require("../models/User");

// Normalize category helper
const normalizeCategory = (input) => {
  if (!input) return null;
  const c = input.trim().toLowerCase();

  if (["wellness", "wellness & spa", "spa"].includes(c)) return "Wellness";
  if (["medical", "health"].includes(c)) return "Medical";
  if (["aesthetician", "beauty", "skin care"].includes(c)) return "Aesthetician";
  if (["personal", "self-care", "self care"].includes(c)) return "Personal";
  if (["lifestyle", "gifts", "fashion"].includes(c)) return "Lifestyle";
  if (["hotel", "hotel rooms", "rooms"].includes(c)) return "Hotel";

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

    const imageUrl = req.file?.path || "";


    const service = await Service.create({
      ...req.body,
      category: normalizedCategory,
      imageUrl,
      providerId: user._id, // Admin can also be set as providerId
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
    const services = await Service.find({ isActive: true }).populate("providerId", "fullName");
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


