const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorised" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString("utf-8");

    if (!decoded.includes(process.env.JWT_SECRET)) {
      return res.status(401).json({ error: "Unauthorised" });
    }

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorised" });
  }
};

module.exports = authMiddleware;
