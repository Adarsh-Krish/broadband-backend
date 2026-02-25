const express = require("express");
const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      token: process.env.JWT_SECRET,
      role: "admin",
      name: "Admin User",
    });
  }

  if (
    email === process.env.PARTNER_EMAIL &&
    password === process.env.PARTNER_PASSWORD
  ) {
    return res.json({
      token: process.env.JWT_SECRET,
      role: "partner",
      slug: "square",
      name: "Square Solutions",
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

module.exports = router;
