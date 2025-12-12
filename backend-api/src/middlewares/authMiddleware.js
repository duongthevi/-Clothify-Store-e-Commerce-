const { verifyToken } = require("../utils/jwt");
const JSend = require("../utils/jsend");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(JSend.fail("Unauthorized"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(JSend.fail("Invalid token"));
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json(JSend.fail("Forbidden"));
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
