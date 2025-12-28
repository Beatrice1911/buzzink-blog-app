const mongoose = require('mongoose');
const Post = require('./models/Post');
const slugify = require('slugify');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI

async function fixSlugs() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const posts = await Post.find({ slug: { $exists: false } });
        console.log(`Found ${posts.length} posts without slugs`);

        for (const post of posts) {
            post.slug = slugify(post.title, { lower: true, strict: true }) + "-" + post._id.toString().slice(-6);
            await post.save();
            console.log(`Updated post ${post.title} -> ${post.slug}`);
        }

        console.log('Slug fixing completed');
        process.exit(0);
    } catch (err) {
        console.error('Error fixing slugs:', err);
        process.exit(1);
    }
}

fixSlugs();