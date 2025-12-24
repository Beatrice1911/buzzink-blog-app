require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./models/Post");

const updateTrendingScore = (post) => {
  const likesCount = post.likes?.length || 0;
  const commentCount = post.commentCount || 0;
  const viewsCount = post.views || 0;

  post.trendingScore = (likesCount * 2) + commentCount + (viewsCount / 5);
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const posts = await Post.find();
    console.log(`Recalculating ${posts.length} posts...`);

    for (const post of posts) {
      updateTrendingScore(post);
      await post.save();
    }

    console.log("✅ Trending scores recalculated");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
