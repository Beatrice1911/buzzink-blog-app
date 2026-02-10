const express = require("express");
const { requireAuth, isAdmin } = require("../middleware/auth");
const { getContactMessages, markAsReadContactMessage, markAllAsReadContactMessages, deleteContactMessage } = require("../controllers/adminContactController");

const router = express.Router();

router.get("/", requireAuth, isAdmin, getContactMessages);
router.patch("/:id/read", requireAuth, isAdmin, markAsReadContactMessage);
router.patch("/mark-all-read", requireAuth, isAdmin, markAllAsReadContactMessages);
router.delete("/:id", requireAuth, isAdmin, deleteContactMessage);

module.exports = router;