const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/:postId", requireAuth, createComment);
router.get("/:postId", getCommentsByPost);
router.delete("/:commentId", requireAuth, deleteComment);

module.exports = router;
