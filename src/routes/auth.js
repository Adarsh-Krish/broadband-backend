const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    const isPartner =
      email === process.env.PARTNER_EMAIL &&
      password === process.env.PARTNER_PASSWORD;

    if (isAdmin) {
      const token = Buffer.from(
        `${email}:${process.env.JWT_SECRET}:${Date.now()}`,
      ).toString("base64");
      return res.json({
        token,
        role: "admin",
        name: "Admin",
      });
    }

    if (isPartner) {
      const token = Buffer.from(
        `${email}:${process.env.JWT_SECRET}:${Date.now()}`,
      ).toString("base64");
      return res.json({
        token,
        role: "partner",
        slug: "square",
        name: "Square Solutions",
      });
    }

    // Generic error — don't reveal which field is wrong
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
