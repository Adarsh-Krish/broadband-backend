const express = require("express");
const router = express.Router();
const leads = require("../data/leads");
const auth = require("../middleware/auth");

// POST /api/leads — public, merchant submits lead
router.post("/", (req, res) => {
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
  if (!business || !email || !phone || !postcode) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const lead = leads.create({
    business,
    contactName,
    email,
    phone,
    address,
    postcode,
    partner: partner || "direct",
    package: pkg || "Unknown",
  });
  res
    .status(201)
    .json({
      success: true,
      reference: `BB-${lead.id.slice(0, 5).toUpperCase()}`,
      lead,
    });
});

// GET /api/leads — admin only
router.get("/", auth, (req, res) => {
  res.json(leads.getAll());
});

// GET /api/leads/partner/:slug — partner sees own leads
router.get("/partner/:slug", auth, (req, res) => {
  const partnerLeads = leads.getByPartner(req.params.slug);
  res.json(partnerLeads);
});

// GET /api/leads/:id — single lead
router.get("/:id", auth, (req, res) => {
  const lead = leads.getById(req.params.id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

// PATCH /api/leads/:id/status — update status
router.patch("/:id/status", auth, (req, res) => {
  const { status } = req.body;
  const allowed = ["New", "Contacted", "Closed"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const lead = leads.updateStatus(req.params.id, status);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json({ success: true, lead });
});

module.exports = router;
