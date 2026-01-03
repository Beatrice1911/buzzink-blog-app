const express = require("express");
const { register, login, me, logout, refresh, verify, forgotPassword, resetPassword, createFirstAdmin } = require('../controllers/authController');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/verify', verify);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// router.post('/create-first-admin', createFirstAdmin);

module.exports = router;
