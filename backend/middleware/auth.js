const jwt = require('jsonwebtoken');
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

async function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      console.error("Auth error:", err);
      return res.status(401).json({ message: "Invalid token" });
  }
}

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.sub, email: decoded.email, name: decoded.name, role: decoded.role };
  } catch (err) {
    // Ignore errors for optional auth
  }
  next();
};

const verifyToken = async (req, res, next) => {
  try {
     const authHeader = req.headers.authorization;
     if (!authHeader) return res.status(401).json({ message: "No token provided" });

      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(payload.sub).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }
      req.user = user;
      next();
  } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const isAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  verifyToken,
  isAdmin
};

