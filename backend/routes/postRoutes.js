const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");
const path = require("path");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "buzzink_post_images",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "webp", "avif"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage });

const { getPosts, getPostById, createPost, updatePost, deletePost, likePost, unlikePost, getTrendingPosts, incrementView } = require("../controllers/postController");

router.get("/", optionalAuth, getPosts);
router.get("/mine", requireAuth, getPosts);
router.get("/trending", getTrendingPosts);
router.get("/:id",optionalAuth, getPostById);
router.get("/:id/view", optionalAuth, incrementView);
router.post("/", requireAuth, upload.single("image"), createPost);
router.post("/:id/like", requireAuth, likePost);
router.post("/:id/unlike", requireAuth, unlikePost);
router.put("/:id", requireAuth, upload.single("image"), updatePost);
router.delete("/:id", requireAuth, deletePost);

module.exports = router;
