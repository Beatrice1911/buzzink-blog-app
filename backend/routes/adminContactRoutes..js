const express = require("express");
const { requireAuth, isAdmin } = require("../middleware/auth");
const { getContactMessages, markAsReadContactMessage } = require("../controllers/adminContactController");

const router = express.Router();

router.get("/", requireAuth, isAdmin, getContactMessages);
router.patch("/:id/read", requireAuth, isAdmin, markAsReadContactMessage);

module.exports = router;