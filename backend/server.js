const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();


const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "mini-blog-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24,
  }
}))

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://buzzink.onrender.com"
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
  credentials: true
};

app.use(cors(corsOptions));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", cors(corsOptions), express.static(path.join(__dirname, "uploads")));
app.use("/api/comments", commentRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

  // Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend"))); 
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });


