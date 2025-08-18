const mongoose = require("mongoose");

const SupportCommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  region: String,
  whatsapp: String,
  telegram: String,

  userType: {
    type: String,
    enum: ["individual", "corporate"],
    default: "individual",
  },

  membershipId: { type: String, unique: true, index: true, sparse: true },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date, default: null },

  roles: {
    type: [String],
    enum: [
      "Gifter",
      "Influencer",
      "Digital Creator",   // ✅ new role added
      "Brand Ambassador",
      "Service Provider",
      "Volunteer",
    ],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one role must be selected",
    },
  },

  // Influencer fields
  influencerTier: {
    type: String,
    enum: [
      "Mega Influencer",
      "Macro Influencer",
      "Micro Influencer",
      "Nano Influencer",
    ],
    default: null,
  },
  influencerRoles: [String],

  // Digital Creator fields ✅
  digitalCreatorTier: {
    type: String,
    enum: [
      "Professional Creator",
      "Independent Creator",
      "Part-time Creator",
    ],
    default: null,
  },
  digitalCreatorRoles: [String],

  // Brand Ambassador fields
  brandAmbassadorTier: {
    type: String,
    enum: [
      "Celebrity Ambassador",
      "Community Advocate",
      "Industry Expert",
      "Customer Ambassador",
    ],
    default: null,
  },
  brandAmbassadorRoles: [String],

  // Service Provider fields
  serviceProviderTier: {
    type: String,
    enum: ["Primary Healthcare Provider", "Specialized Service Provider"],
    default: null,
  },

  // Volunteer fields
  volunteerTier: {
    type: String,
    enum: [
      "coreVolunteer",
      "projectBasedVolunteer",
      "occasionalVolunteer",
      "virtualVolunteer",
      "studentVolunteer",
    ],
    default: null,
  },

  supportTypes: [String],
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportCommunity", SupportCommunitySchema);




