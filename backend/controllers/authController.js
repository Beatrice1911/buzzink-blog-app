const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ms = require("ms");
const crypto = require("crypto");
const {
  createVerificationToken,
  sendVerificationEmail,
  sendResetEmail,
} = require("../config/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
};

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

async function signRefreshToken(user) {
  const token = jwt.sign({ sub: user._id.toString() }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

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
    const { email, password, name, role } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const verifyToken = createVerificationToken();

    const user = new User({
      email,
      password,
      name,
      role: role || "reader",
      verified: false,
      verifyToken,
      verifyExpires: Date.now() + 30 * 60 * 1000,
    });

    await user.save();

    await sendVerificationEmail(user.email, verifyToken);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    verifyToken: token,
    verifyExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).send("Invalid or expired link");

  user.verified = true;
  user.verifyToken = null;
  user.verifyExpires = null;

  await user.save();

  res.redirect("/index.html?verified=true");
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = signToken(user);
    const refreshToken = await signRefreshToken(user);

    res
      .cookie("accessToken", token, {
        ...cookieOptions,
        maxAge: ms(JWT_EXPIRES_IN),
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: ms(JWT_REFRESH_EXPIRES_IN),
      })
      .json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
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
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const stored = await RefreshToken.findOne({
      userId: payload.sub,
      token: refreshToken,
    });
    if (!stored)
      return res.status(403).json({ message: "Invalid refresh token" });

    await RefreshToken.deleteOne({ _id: stored._id });

    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = signToken(user);
    const newRefreshToken = await signRefreshToken(user);

    res
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: ms(JWT_EXPIRES_IN),
      })
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: ms(JWT_REFRESH_EXPIRES_IN),
      })
      .json({ message: "Token refreshed" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.warn("Refresh token expired: ", err.expiredAt);
      return res
        .status(403)
        .json({ message: "Refresh token expired. Please log in again." });
    }
    console.error("Refresh error:", err.message);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ ok: true });

    const resetToken = createVerificationToken();
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await user.save();

    await sendResetEmail(user.email, resetToken);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resendVerification = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || user.verified) return res.json({ ok: true });

  const token = createVerificationToken();

  user.verifyToken = token;
  user.verifyExpires = Date.now() + 3600000;

  await user.save();

  await sendVerificationEmail(user.email, token);

  res.json({ ok: true });
};

// exports.createFirstAdmin = async (req, res, next) => {
//   try {
//     const adminExists = await User.findOne({ role: "admin" });
//     if (adminExists) {
//       return res.status(403).json({ message: "Admin already exists" });
//     }

//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email, and password are required" });
//     }

//     const user = new User({ name, email, password, role: "admin" });
//     await user.save();

//     const token = signToken(user);

//     res.status(201).json({
//       message: "First admin created successfully",
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//       token
//     });
//   } catch (err) {
//     next(err);
//   }
// };
