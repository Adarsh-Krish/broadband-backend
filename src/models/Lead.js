const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    business: { type: String, required: true },
    contactName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    postcode: { type: String, required: true },
    partner: { type: String, default: "direct" },
    package: { type: String, default: "Unknown" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
    commission: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", leadSchema);
