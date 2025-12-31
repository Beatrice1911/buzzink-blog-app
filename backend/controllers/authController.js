const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ms = require("ms");
const crypto = require('crypto');
const sendEmail = require("../config/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh");
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function signRefreshToken(user) {
  const token = jwt.sign(
    { sub: user._id.toString() },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  await RefreshToken.deleteMany({ userId: user._id });

  await RefreshToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + ms(JWT_REFRESH_EXPIRES_IN)),
  });

  return token;
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const user = new User({ email, password, name });
    await user.save();

    const token = signToken(user);
    const refreshToken = await signRefreshToken(user);

    res.json({
      token,
      refreshToken,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    const refreshToken = await signRefreshToken(user);

    res.json({
      token,
      refreshToken,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.json({ user: null });

    res.json({
      user: { id: user._id.toString(), email: user.email, name: user.name }
    });
  } catch (err) {
    next(err);
  }
};


exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const stored = await RefreshToken.findOne({ userId: payload.sub, token: refreshToken });
    if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

    await RefreshToken.deleteOne({ _id: stored._id });

    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = signToken(user);
    const newRefreshToken = await signRefreshToken(user);

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.warn("Refresh token expired: ", err.expiredAt);
      return res.status(403).json({ message: "Refresh token expired. Please log in again."});
    }
    console.error("Refresh error:", err.message);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

exports.verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 30 minutes.</p>
      `
    });

    res.status(200).json({ message: "Reset link sent to your email" });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const resetToken = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
