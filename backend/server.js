const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const Post = require("./models/Post");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://buzzink.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("/post/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "post.html"));
});

app.get("/post/:slug", async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).send("Post not found");

    const indexHtml = fs.readFileSync(
      path.join(__dirname, "../frontend/dist/index.html"),
      "utf8",
    );

    const desc = post.content?.slice(0, 160) || post.title;
    const imageUrl = post.image || "/Images/fallback.jpg";
    const postUrl = `https://buzzink.onrender.com/post/${slug}`;
    const createdAt = post.createdAt?.toISOString() || new Date().toISOString();
    const updatedAt = post.updatedAt?.toISOString() || createdAt;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: desc,
      image: imageUrl ? [imageUrl] : [],
      author: {
        "@type": "Person",
        name: post.authorName || "BuzzInk Contributor",
      },
      publisher: {
        "@type": "Organization",
        name: "BuzzInk",
        logo: {
          "@type": "ImageObject",
          url: "https://buzzink.onrender.com/Images/logo_optimized.png",
        },
      },
      datePublished: createdAt,
      dateModified: updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": postUrl,
      },
    };

    const html = indexHtml
      .replace(/<title>.*<\/title>/, `<title>${post.title} - BuzzInk</title>`)
      .replace(
        /<meta name="description" content="">/,
        `<meta name="description" content="${desc}">`,
      )
      .replace(
        /<meta property="og:title" content="">/,
        `<meta property="og:title" content="${post.title}">`,
      )
      .replace(
        /<meta property="og:description" content="">/,
        `<meta property="og:description" content="${desc}">`,
      )
      .replace(
        /<meta property="og:image" content="">/,
        `<meta property="og:image" content="${imageUrl}">`,
      )
      .replace(
        /<meta property="og:url" content="">/,
        `<meta property="og:url" content="${postUrl}">`,
      )
      .replace(
        /<meta name="twitter:title" content="">/,
        `<meta name="twitter:title" content="${post.title}">`,
      )
      .replace(
        /<meta name="twitter:description" content="">/,
        `<meta name="twitter:description" content="${desc}">`,
      )
      .replace(
        /<meta name="twitter:image" content="">/,
        `<meta name="twitter:image" content="${imageUrl}">`,
      )
      .replace(
        /<\/head>/,
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head>`,
      );

    res.send(html);
  } catch (err) {
    next(err);
  }
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:", "https://res.cloudinary.com"],
        connectSrc: [
          "'self'",
          "https://buzzink.onrender.com",
          "http://localhost:5000",
        ],
      },
    },
  }),
);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
