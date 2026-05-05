import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

import User from "./models/User.js";
import Post from "./models/Post.js";

dotenv.config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());

app.use(cors({
  origin: "https://blog-website-vert-alpha.vercel.app",
  credentials: true
}));

// ================== STATIC FILES ==================
app.use("/uploads", express.static("uploads"));

// ================== MULTER SETUP ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================== MONGODB ==================
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// ================== AUTH MIDDLEWARE ==================
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================== ROUTES ==================

// 🔹 Register
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "User registered" });

  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// 🔹 Create Post
app.post("/posts", auth, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const coverImage = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const post = await Post.create({
      title,
      content,
      coverImage,
      author: req.user.email,
      userId: req.user.id
    });

    res.status(201).json(post);

  } catch {
    res.status(500).json({ message: "Error creating post" });
  }
});

// 🔹 Get Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// 🔹 Delete Post
app.delete("/posts/:id", auth, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});