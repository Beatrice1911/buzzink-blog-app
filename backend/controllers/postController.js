const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Post = require("../models/Post");


const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const userId = req.user?.id || null;

    let filter = {};
    if (req.path.includes("/mine")) {
      filter = { authorId: userId };
    }

    if (req.query.authorId) {
      filter.authorId = new mongoose.Types.ObjectId(req.query.authorId);
    }

    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("likes", "name profilePhoto")
      .populate("authorId", "_id name profilePhoto");

    const updatedPosts = posts.map(post => {
      const likedByUser = userId
        ? post.likes.some(like => like._id.toString() === userId)
        : false;

      return {
        ...post.toObject(),
        likesCount: post.likes.length,
        likedBy: post.likes.map(like => like.name),
        likedByUser,
      };
    });

    res.json({
      posts: updatedPosts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


const getPostById = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const post = await Post.findById(req.params.id)
      .populate("likes", "name profilePhoto")
      .populate("authorId", "_id name profilePhoto");

    if (!post) return res.status(404).json({ message: "Post not found" });

    const likedByUser = userId
      ? post.likes.some(like => like._id.toString() === userId)
      : false;

    res.json({
      ...post.toObject(),
      likesCount: post.likes.length,
      likedBy: post.likes.map(like => like.name),
      likedByUser,
    });
  } catch (err) {
    console.error("Get post by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    const authorId = req.user.id;
    const authorName = req.user.name;
    const imagePath = req.file ? req.file.secure_url : null;

    const newPost = new Post({
      title,
      content,
      authorId,
      authorName,
      category,
      image: imagePath,
      date: new Date(),
    });

    await newPost.save();
    res.status(201).json({
      _id: newPost._id,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      image: newPost.image,
      date: newPost.date,
      author: { id: authorId, name: authorName }
    });
    console.log("FILE:", req.file);

  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author of this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    if (req.file) post.image = req.file.secure_url;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }

};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author of this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.some(u => u.toString() === req.user.id)) {
      post.likes.push(req.user.id);
      updateTrendingScore(post);
      await post.save();
    }

    const updatedPost = await Post.findById(req.params.id)
      .populate("likes", "name");

    res.json({
      likes: updatedPost.likes.length,
      likedBy: updatedPost.likes.map(u => u.name)
    });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(u => u.toString() !== req.user.id);
    updateTrendingScore(post);
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("likes", "name");

    res.json({
      likes: updatedPost.likes.length,
      likedBy: updatedPost.likes.map(u => u.name)
    });
  } catch (err) {
    console.error("Unlike error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTrendingPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const trendingPosts = await Post.find()
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(limit)
      .populate("likes", "name")
      .select("title content likes views commentCount createdAt authorId authorName");
    res.status(200).json(trendingPosts);
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    res.status(500).json({ message: "Failed to fetch trending posts" });
  }
}

const updateTrendingScore = (post) => {
  const likesCount = post.likes?.length || 0;
  const commentCount = post.commentCount || 0;
  const viewsCount = post.views || 0;

  const hoursSincePost = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);

  post.trendingScore = ((likesCount * 2) + commentCount + (viewsCount / 5)) / (hoursSincePost + 1);
};

const incrementView = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.user) {
    const hasViewed = post.viewedBy.includes(req.user._id);

    if (!hasViewed) {
      post.views += 1;
      post.viewedBy.push(req.user._id);
      await post.save();
    }
  } else {
    post.views += 1;
    await post.save();
  }

  res.json({ views: post.views });
}


module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getTrendingPosts,
  incrementView,
};