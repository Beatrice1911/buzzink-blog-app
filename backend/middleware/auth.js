const jwt = require('jsonwebtoken');


function requireAuth(req, res, next) {
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
    req.user = { id: decoded.sub, email: decoded.email, name: decoded.name };
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
    req.user = { id: decoded.sub, email: decoded.email, name: decoded.name };
  } catch (err) {
    // do nothing if invalid
  }
  next();
};



module.exports = {
  requireAuth,
  optionalAuth
};

