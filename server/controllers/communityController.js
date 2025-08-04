const CommunityMember = require("../models/CommunityMember");
const cloudinary = require("../config/cloudinary");

exports.createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      location,
      specialization,
      memberType,
    } = req.body;

    const files = req.files;

    if (!files?.cv?.[0] || !files?.credentials?.[0]) {
      return res.status(400).json({ message: "Both CV and Credentials are required." });
    }

    // Helper to upload buffer to Cloudinary
    const uploadToCloudinary = (fileBuffer, folder) => {
      return new Promise((resolve, reject) => {
        const stream = require("stream");
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }).end(fileBuffer);
      });
    };

    const cvUrl = await uploadToCloudinary(files.cv[0].buffer, "wanaw-cv");
    const credentialsUrl = await uploadToCloudinary(files.credentials[0].buffer, "wanaw-credentials");

    const newMember = new CommunityMember({
      name,
      email,
      phone,
      whatsapp,
      location,
      specialization,
      memberType,
      cvUrl,
      credentialsUrl,
    });

    await newMember.save();

    res.status(201).json({ message: "Membership form submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting membership form:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await CommunityMember.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error("❌ Error fetching community members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
