const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    currentProvider: { type: String, required: true },
    monthlyPayment: { type: String, required: true },
    contractEndDate: { type: String },
    notes: { type: String },
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
