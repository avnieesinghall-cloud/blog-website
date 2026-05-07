import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";

import User from "./models/User.js";
import Post from "./models/Post.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));

/* DATABASE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* FILE UPLOAD */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* AUTH MIDDLEWARE */
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const cleanToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("🚀 InsightFlow Backend Running");
});

/* REGISTER */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("❌ Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* LOGIN */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("❌ Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* CREATE POST */
app.post("/posts", auth, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, content, category, coverImage, cover } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://insightflow-backend-7vjp.onrender.com"
        : "http://localhost:5000";

    const finalCoverImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : coverImage || cover || "";

    const post = await Post.create({
      title,
      content,
      category,
      coverImage: finalCoverImage,
      author: req.user.email,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.log("❌ Create Post Error:", err);
    res.status(500).json({ message: "Error creating post" });
  }
});

/* GET ALL POSTS */
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log("❌ Fetch Posts Error:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

/* GET SINGLE POST */
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.log("❌ Fetch Single Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* UPDATE POST */
app.put("/posts/:id", auth, upload.single("coverImage"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot edit this post" });
    }

    const { title, content, category, coverImage, cover } = req.body;

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://insightflow-backend-7vjp.onrender.com"
        : "http://localhost:5000";

    const finalCoverImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : coverImage || cover || post.coverImage;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        coverImage: finalCoverImage,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.log("❌ Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* DELETE POST */
app.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log("❌ Delete Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});