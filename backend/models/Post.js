const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorName: { type: String},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String, required: true },
    image: { type: String, default: null },
    date: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    viewdBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentCount: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Post", postSchema);
