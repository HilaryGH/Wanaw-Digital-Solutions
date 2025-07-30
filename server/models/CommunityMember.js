const mongoose = require("mongoose");

const communityMemberSchema = new mongoose.Schema({
  memberType: {
    type: String,
    enum: ["healthcare", "freshGraduate"],
    required: true,
  },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
  },
  phone: { type: String, required: true },
  whatsapp: String,
  location: String,
  specialization: { type: String, required: true },
  cvUrl: { type: String, required: true },
  credentialsUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("CommunityMember", communityMemberSchema);
