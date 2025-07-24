const mongoose = require("mongoose");

const partnerRequestSchema = new mongoose.Schema(
  {
    tab: {
      type: String,
      enum: ["Investor", "Strategic Partner"],
      required: true,
    },
    investmentType: {
      type: [String], // now it's an array
      enum: ["Equity", "Debt", "Other Alternative Investment"],
      validate: {
        validator: function (v) {
          if (this.tab === "Investor") return Array.isArray(v) && v.length > 0;
          return true;
        },
        message: "At least one Investment Type is required for Investors.",
      },


      validate: {
        validator: function (v) {
          if (this.tab === "Investor") return !!v;
          return true; // if not Investor, don't require investmentType
        },
        message: "Investment Type is required for Investors.",
      },
    },

    // Common Fields
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: { type: String, required: true },
    whatsapp: String,
    enquiry: String,

    // Uploaded files - storing Cloudinary URLs
    idOrPassport: String,
    license: String,
    tradeRegistration: String,

    // Strategic Partner files
    businessProposal: String,
    businessPlan: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerRequest", partnerRequestSchema);

