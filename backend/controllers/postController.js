const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");
const User = require("../models/User")

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6, status } = req.query;
    const userId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null;

    let filter = {};
    if (req.path.includes("/mine")) {
      filter.authorId = userId;

      if (status) {
        filter.status = { $in: Array.isArray(status) ? status : [status] };
      }
    } else {
      filter.status = "published";
    }

    if (req.query.authorId) {
      filter.authorId = new mongoose.Types.ObjectId(req.query.authorId);
    }

    const total = await Post.countDocuments(filter);

    const posts = await Post.aggregate([
      { $match: filter },
      {
        $addFields: {
          sortDate: {
            $ifNull: ["$publishedAt", "$createdAt"]
          }
        }
      },
      { $sort: { sortDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) }
    ]);

    await Post.populate(posts, [
      { path: "likes", select: "name profilePhoto", strictPopulate: false },
      { path: "authorId", select: "_id name profilePhoto", strictPopulate: false }
    ]);

    const updatedPosts = posts.map(post => {
      const likedByUser = userId
        ? post.likes.some(like => like._id.toString() === userId)
        : false;

      const dateToShow = post.publishedAt || post.createdAt || Date.now();
 
      return {
        ...post,
        slug: post.slug,
        likesCount: post.likes.length,
        likedBy: post.likes.map(like => like.name),
        likedByUser,
        displayDate: new Date(dateToShow),
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


const getPostBySlug = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate("likes", "name profilePhoto")
      .populate("authorId", "_id name profilePhoto");

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.status === "draft" && post.authorId.toString() !== userId) {
      return res.status(403).json({ message: "This post is a draft" });
    }

    const likedByUser = userId
      ? post.likes.some(like => like._id.toString() === userId)
      : false;

    let savedByUser = false;
    if (userId) {
      const user = await User.findById(userId).select("savedPosts");
      savedByUser = user.savedPosts.some(
        savedPostId => savedPostId.toString() === post._id.toString()
      );
    }

    res.json({
      ...post.toObject(),
      likesCount: post.likes.length,
      likedBy: post.likes.map(like => like.name),
      likedByUser,
      savedByUser,
    });
  } catch (err) {
    console.error("Get post by slug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, category, status = "draft" } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    let imagePath = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "buzzink_posts"
      });
      imagePath = result.secure_url;
    }

    const slug = slugify(title, { lower: true, strict: true });

    const authorId = req.user.id;
    const authorName = req.user.name;

    const newPost = new Post({
      title,
      slug,
      content,
      authorId,
      authorName,
      category,
      image: imagePath,
      status,
      publishedAt: status === "published" ? new Date() : null
    });

    await newPost.save();
    res.status(201).json({
      _id: newPost._id,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      image: newPost.image,
      authorId: authorId,
      authorName: authorName,
      slug: newPost.slug,
      status: newPost.status,
      publishedAt: newPost.publishedAt,
    });

  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, category } = req.body;

    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author of this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    if (title) {
      post.slug = slugify(title, { lower: true, strict: true });
    }

    if (req.body.status === "published" && post.status === "draft") {
      post.status = "published";
      post.publishedAt = new Date();
    }
     
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author of this post" });
    }

    await Post.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.some(u => u.toString() === req.user.id)) {
      post.likes.push(req.user.id);
      updateTrendingScore(post);
      await post.save();
    }

    const updatedPost = await Post.findById(req.params.slug)
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
    const post = await Post.findById(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(u => u.toString() !== req.user.id);
    updateTrendingScore(post);
    await post.save();

    const updatedPost = await Post.findById(req.params.slug)
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
  const posts = await Post.find()

  const trendingPosts = posts.map(post => ({
    ...post.toObject(),
    trendingScore: updateTrendingScore(post)
  }))
  .sort((a, b) => b.trendingScore - a.trendingScore)
  .slice(0, 5);

  res.json(trendingPosts);
}

const updateTrendingScore = (post) => {
  const likesCount = post.likes?.length || 0;
  const commentCount = post.commentCount || 0;
  const viewsCount = post.views || 0;

  const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);

  const engagementScore = (likesCount * 3) + commentCount * 2 + (viewsCount * 0.5);

  const decay = Math.max(1, (ageInHours / 18));

  return engagementScore / decay;
}; 

const incrementView = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  let shouldIncrement = true;

  if (req.user) {
    if (post.viewedBy.includes(req.user._id)) {
      shouldIncrement = false;
    } else {
      post.viewedBy.push(req.user._id);
    }
  } 

  if (shouldIncrement) {
    post.views += 1;
    await post.save();
  }

  res.json({ views: post.views });
}

const getPostsByCategory = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const relatedPosts = await Post.find({
      category: post.category,
      slug: { $ne: post.slug }
    })
      .limit(4)
      .select("title slug category createdAt image");

    res.status(200).json(relatedPosts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch related posts" });
  }
}

const savePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user;
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({message: "Post not found"} );

    if (!user.savedPosts.includes(post._id)) {
      user.savedPosts.push(post._id)
      await user.save();
    }

    res.status(200).json({ message: "Post saved successfully" });
  } catch (err) {
    console.error("Save post error:", err);
    res.status(500).json({ message: "Failed to save post" })
  }
}

const unsavePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    };

    const user = req.user;
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    user.savedPosts = user.savedPosts.filter(
      id => id.toString() !== post._id.toString()
    );
    await user.save();

    res.status(200).json({ message: "Post removed from saved posts" });
  } catch (err) {
    console.error("Unsave post error:", err);
    res.status(500).json({ message: "Failed to unsave post"});
  }
}

const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "savedPosts",
        populate: {
          path: "authorId",
          select: "name profilePhoto"
        }
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedPosts);

  } catch (err) {
    console.error("Get saved posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getTrendingPosts,
  incrementView,
  getPostsByCategory,
  savePost,
  unsavePost,
  getSavedPosts,
};