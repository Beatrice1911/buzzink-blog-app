const express = require("express");
const {
  register,
  login,
  me,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.get("/verify-email", verifyEmail);
router.post("/logout", logout);
router.post("/refresh", refresh);
app.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
// router.post('/create-first-admin', createFirstAdmin);

module.exports = router;
