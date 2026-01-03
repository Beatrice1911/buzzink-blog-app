const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const { getAllUsers, deleteUser, getAllPosts, deleteAnyPost, getAllComments, deleteComment, getAdminStats } = require('../controllers/adminController');

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);
router.get('/posts', verifyToken, isAdmin, getAllPosts);
router.delete("/posts/:id", verifyToken, isAdmin, deleteAnyPost);
router.get('/comments', verifyToken, isAdmin, getAllComments);
router.delete('/comments/:id', verifyToken, isAdmin, deleteComment);
router.get('/stats', verifyToken, isAdmin, getAdminStats);

module.exports = router;
