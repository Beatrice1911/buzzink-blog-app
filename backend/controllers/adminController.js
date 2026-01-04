const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getAllUsers = async (req, res) => {
    try {
      let { page = 1, limit = 10, search = '' } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const query = search
        ? { name: { $regex: search, $options: 'i' } }
        : {};
      const totalUsers = await User.countDocuments(query);
      const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);
      res.json({
        data: users,
        total: totalUsers,
        page,
        pages: Math.ceil(totalUsers / limit)
      });
    } catch (error) {
      console.error("Error fetching users:", error);
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
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};
    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
    .populate("authorId", "name email role")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
    res.json({
      data: posts,
      total: totalPosts,
      page,
      pages: Math.ceil(totalPosts / limit)
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
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
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = search
      ? { content: { $regex: search, $options: 'i' } }
      : {};
    
    const totalComments = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate({ path: 'authorId', select: 'name', options: { strictPopulate: false } })
      .populate({ path: 'postId', select: 'title', options: { strictPopulate: false } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const safeComments = comments.map(comment => ({
      _id: comment._id,
      userName: comment.authorId?.name || "Unknown User",
      postTitle: comment.postId?.title || "Deleted Post",
      content: comment.content || comment.comment || comment.text || "[No Content]"
    }));
    res.status(200).json({
      data: safeComments,
      total: totalComments,
      page,
      pages: Math.ceil(totalComments / limit)
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
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
