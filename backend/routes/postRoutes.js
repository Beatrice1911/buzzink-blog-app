const express = require("express");
const multer = require("multer");
const path = require("path");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const { getPosts, getPostById, createPost, updatePost, deletePost, likePost, unlikePost, getTrendingPosts } = require("../controllers/postController");
const { create } = require("../models/Post");

router.get("/", optionalAuth, getPosts);
router.get("/mine", requireAuth, getPosts);
router.get("/trending", getTrendingPosts);
router.get("/:id",optionalAuth, getPostById);
router.post("/", requireAuth, upload.single("image"), createPost);
router.post("/:id/like", requireAuth, likePost);
router.post("/:id/unlike", requireAuth, unlikePost);
router.put("/:id", requireAuth, upload.single("image"), updatePost);
router.delete("/:id", requireAuth, deletePost);

module.exports = router;
