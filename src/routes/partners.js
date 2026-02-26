const express = require("express");
const router = express.Router();
const Partner = require("../models/Partner");
const auth = require("../middleware/auth");

// GET /api/partners
router.get("/", auth, async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/partners
router.post("/", auth, async (req, res) => {
  try {
    const { name, slug, commission } = req.body;
    if (!name || !slug || !commission) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const exists = await Partner.findOne({ slug });
    if (exists) {
      return res.status(409).json({ error: "Slug already exists" });
    }
    const partner = await Partner.create({
      name,
      slug,
      commission: +commission,
    });
    res.status(201).json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/partners/:id
router.patch("/:id", auth, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!partner) return res.status(404).json({ error: "Partner not found" });
    res.json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/partners/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ error: "Partner not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
