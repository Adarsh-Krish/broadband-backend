const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || token !== `Bearer ${process.env.JWT_SECRET}`) {
    return res.status(401).json({ error: "Unauthorised" });
  }
  next();
};

module.exports = authMiddleware;
