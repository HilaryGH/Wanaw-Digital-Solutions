const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String }, // URL or relative path
  services: [{ type: String }],
});

module.exports = mongoose.model("Program", ProgramSchema);
