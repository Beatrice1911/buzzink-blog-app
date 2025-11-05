const express = require("express");
const multer = require("multer");
const path = require("path");
const { requireAuth } = require("../middleware/auth");
const { updateUserProfile, getUserProfile, getCurrentUser } = require("../controllers/userController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, upload.single("profilePhoto"), updateUserProfile);
router.get("/:name", getUserProfile);

module.exports = router;
