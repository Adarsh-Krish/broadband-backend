const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");
const sendLeadEmail = require("../utils/sendEmail");

// POST /api/leads — public
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      businessName,
      email,
      phone,
      address,
      currentProvider,
      monthlyPayment,
      contractEndDate,
      notes,
    } = req.body;

    if (
      !fullName ||
      !businessName ||
      !email ||
      !phone ||
      !address ||
      !currentProvider ||
      !monthlyPayment
    ) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" });
    }

    const lead = await Lead.create({
      fullName,
      businessName,
      email,
      phone,
      address,
      currentProvider,
      monthlyPayment,
      contractEndDate,
      notes,
    });

    // Send email notification
    try {
      await sendLeadEmail(lead);
      console.log("✅ Email sent for lead:", lead._id);
    } catch (emailErr) {
      console.error("❌ Email failed:", emailErr.message);
      // Don't fail the request if email fails
    }

    const reference = `BB-${lead._id.toString().slice(-5).toUpperCase()}`;
    res.status(201).json({ success: true, reference, lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads — admin
router.get("/", auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["New", "Contacted", "Closed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const commission = status === "Closed" ? 150 : 0;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, commission },
      { new: true },
    );
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
