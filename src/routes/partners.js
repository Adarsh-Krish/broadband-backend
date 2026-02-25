const express = require("express");
const router = express.Router();
const partners = require("../data/partners");
const auth = require("../middleware/auth");

// GET /api/partners
router.get("/", auth, (req, res) => {
  res.json(partners.getAll());
});

// POST /api/partners
router.post("/", auth, (req, res) => {
  const { name, slug, commission } = req.body;
  if (!name || !slug || !commission) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (partners.getBySlug(slug)) {
    return res.status(409).json({ error: "Slug already exists" });
  }
  const partner = partners.create({ name, slug, commission: +commission });
  res.status(201).json({ success: true, partner });
});

// DELETE /api/partners/:id
router.delete("/:id", auth, (req, res) => {
  const deleted = partners.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Partner not found" });
  res.json({ success: true });
});

module.exports = router;
