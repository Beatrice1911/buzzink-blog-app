const express = require("express");
const Comment = require("../models/Comment");
const post = require("../models/Post");

const createComment = async (req, res) => {
    try {
    const { text } = req.body;
    const { postId } = req.params;
    const newComment = new Comment({
      postId,
      authorId: req.user.id,
      text,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getCommentsByPost = async (req, res) => {
    try {
    const { postId } = req.params;

    let comments;

    comments = await Comment.find({ postId })
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });

    if (comments.length === 0) {
      const post = await Post.findOne({ slug: postId });
      if (post) {
        comments = await Comment.find({ postId: post._id.toString() })
          .populate("authorId", "name email")
          .sort({ createdAt: -1 });
      }
    }
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized"});
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment
};


