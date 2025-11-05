const express = require("express");
const { register, login, me, logout, refresh } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
