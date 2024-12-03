const mongoose = require("mongoose");

const unisatRequirementSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true, // Ensures each key is unique
    trim: true,
  },
  value: {
    type: String,
    required: true,
    default:null,
    trim: true, // Ensures no unnecessary whitespace
  },
});

module.exports = mongoose.model("UnisatRequirement", unisatRequirementSchema);
