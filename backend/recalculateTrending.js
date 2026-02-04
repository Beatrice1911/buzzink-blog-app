const mongoose = require("mongoose");
require("dotenv").config();
const Post = require("./models/Post")
const { updateTrendingScore } = require("./controllers/postController");

const recalcTrendingScores = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const posts = await Post.find();
    console.log(`Recalculating trending scores for ${posts.length} posts...`);

    for (const post of posts) {
      post.lastEngagementAt = post.lastEngagementAt || post.createdAt;
      updateTrendingScore(post);
      await post.save();
      console.log(`Updated: ${post.title} → trendingScore: ${post.trendingScore}`);
    }

    console.log("✅ All trending scores updated!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error recalculating trending scores:", err);
    mongoose.disconnect();
  }
};

recalcTrendingScores();
