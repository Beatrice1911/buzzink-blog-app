const express = require("express");
const multer = require("multer");
const path = require("path");
const { requireAuth } = require("../middleware/auth");
const { updateUserProfile, getUserProfile, getCurrentUser } = require("../controllers/userController");

const router = express.Router();

const upload = multer({ storage: multer.diskStorage({}) });

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, upload.single("profilePhoto"), updateUserProfile);
router.get("/id/:id", getUserProfile);

module.exports = router;
