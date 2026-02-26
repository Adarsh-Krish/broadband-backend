const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");

// POST /api/leads — public
router.post("/", async (req, res) => {
  try {
    const {
      business,
      contactName,
      email,
      phone,
      address,
      postcode,
      partner,
      package: pkg,
    } = req.body;
    if (!business || !email || !postcode) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const lead = await Lead.create({
      business,
      contactName,
      email,
      phone,
      address,
      postcode,
      partner: partner || "direct",
      package: pkg || "Unknown",
    });
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

// GET /api/leads/partner/:slug
router.get("/partner/:slug", auth, async (req, res) => {
  try {
    const leads = await Lead.find({ partner: req.params.slug }).sort({
      createdAt: -1,
    });
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
