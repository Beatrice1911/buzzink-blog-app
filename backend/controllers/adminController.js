const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Optional: Delete posts/comments of the user
    await Post.deleteMany({ authorId: id });
    await Comment.deleteMany({ authorId: id });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("authorId", "name email role");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAnyPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({ path: 'authorId', select: 'name', options: { strictPopulate: false } })
      .populate({ path: 'postId', select: 'title', options: { strictPopulate: false } });
      
    const safeComments = comments.map(comment => ({
      _id: comment._id,
      userName: comment.authorId?.name || "Unknown User",
      postTitle: comment.postId?.title || "Deleted Post",
      content: comment.content || comment.comment || comment.text || "[No Content]"
    }));
    res.status(200).json(safeComments);
  } catch (err) {
    console.error('Admin comments error:', err);
    res.status(200).json([]);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdminStats = async (req, res) => {
  const users = await User.countDocuments();
  const posts = await Post.countDocuments();
  const comments = await Comment.countDocuments();

  res.json({ users, posts, comments });
};
