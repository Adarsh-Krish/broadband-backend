const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");
const sendLeadEmail = require("../utils/sendEmail");

const leadValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .escape(),
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Phone is required").escape(),
  body("address").trim().notEmpty().withMessage("Address is required").escape(),
  body("currentProvider")
    .trim()
    .notEmpty()
    .withMessage("Current provider is required")
    .escape(),
  body("monthlyPayment")
    .trim()
    .notEmpty()
    .withMessage("Monthly payment is required")
    .escape(),
  body("contractEndDate").optional().trim().escape(),
  body("notes").optional().trim().escape(),
];

// POST /api/leads — public
router.post("/", leadValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }

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

    // Send email
    try {
      await sendLeadEmail(lead);
      console.log("✅ Email sent for lead:", lead._id);
    } catch (emailErr) {
      console.error("❌ Email failed:", emailErr.message);
    }

    const reference = `BB-${lead._id.toString().slice(-5).toUpperCase()}`;
    res.status(201).json({ success: true, reference, lead });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/leads — admin
router.get("/", auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/leads/partner/:slug
router.get("/partner/:slug", auth, async (req, res) => {
  try {
    const leads = await Lead.find({ partner: req.params.slug }).sort({
      createdAt: -1,
    });
    res.json(leads);
  } catch {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/leads/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch {
    res.status(500).json({ error: "Something went wrong" });
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
  } catch {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
