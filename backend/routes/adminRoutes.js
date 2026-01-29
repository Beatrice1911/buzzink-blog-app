const express = require("express");
const router = express.Router();
const { requireAuth, isAdmin } = require("../middleware/auth");
const {
  getAllUsers,
  deleteUser,
  getAllPosts,
  deleteAnyPost,
  getAllComments,
  deleteComment,
  getAdminStats,
} = require("../controllers/adminController");

router.get("/users", requireAuth, isAdmin, getAllUsers);
router.delete("/users/:id", requireAuth, isAdmin, deleteUser);
router.get("/posts", requireAuth, isAdmin, getAllPosts);
router.delete("/posts/:id", requireAuth, isAdmin, deleteAnyPost);
router.get("/comments", requireAuth, isAdmin, getAllComments);
router.delete("/comments/:id", requireAuth, isAdmin, deleteComment);
router.get("/stats", requireAuth, isAdmin, getAdminStats);

module.exports = router;
