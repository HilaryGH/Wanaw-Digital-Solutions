const mongoose = require("mongoose");

const partnerRequestSchema = new mongoose.Schema(
  {
    tab: {
      type: String,
      enum: ["Investor", "Strategic Partner", "Co Branding"],
      required: true,
    },

    // Investor & Strategic Partner fields
    investmentType: {
      type: [String],
      enum: ["Equity", "Debt", "Other Alternative Investment"],
      validate: {
        validator: function (v) {
          if (this.tab === "Investor") return Array.isArray(v) && v.length > 0;
          return true;
        },
        message: "At least one Investment Type is required for Investors.",
      },
    },
    sector: {
      type: String,
      enum: ["Bank", "Hotel", "Business Company", "NGOs", "Health Sectors"],
    },

    // Common fields
    name: { type: String, required: true },
    companyName: { type: String },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: { type: String },
    officePhone: { type: String },
    whatsapp: { type: String },
    enquiry: { type: String },
    motto: { type: String },
    specialPackages: { type: String },
    messages: { type: String },
    coBrand: { type: String },
    effectiveDate: { type: Date },
    expiryDate: { type: Date },

    // Uploaded files - storing URLs (e.g., Cloudinary)
    idOrPassport: String,
    license: String,
    tradeRegistration: String,
    businessProposal: String,
    businessPlan: String,
    logo: String,
    mouSigned: String,
    contractSigned: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerRequest", partnerRequestSchema);


