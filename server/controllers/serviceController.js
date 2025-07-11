const Service = require("../models/Service");
const User = require("../models/User");

exports.createService = async (req, res) => {
  const user = req.user;

  if (user.role !== "provider") {
    return res.status(403).json({ msg: "Only providers can add services" });
  }

  const allowedMemberships = ["basic", "premium", "enterprise"];
  if (!allowedMemberships.includes(user.membership)) {
    return res.status(403).json({ msg: "Upgrade membership to add services" });
  }

  const limits = {
    basic: 3,
    premium: 10,
    enterprise: 50,
  };

  try {
    const existingCount = await Service.countDocuments({ providerId: user._id });

    if (existingCount >= limits[user.membership]) {
      return res.status(403).json({
        msg: `Limit reached for ${user.membership} membership. Upgrade to add more services.`,
      });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const service = await Service.create({
      ...req.body,
      imageUrl,
      providerId: user._id,
    });

    res.status(201).json({ msg: "Service created successfully", service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create service" });
  }
};


// GET all services (with filters later)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate("providerId", "fullName");
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching services" });
  }
};

// GET single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("providerId", "fullName");
    if (!service) return res.status(404).json({ msg: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching service" });
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

// ... existing code ...
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
