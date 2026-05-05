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

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://blog-website-vert-alpha.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.log("❌ Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
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
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.log("❌ Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/posts", auth, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://blog-backend-rn0w.onrender.com"
        : "http://localhost:5000";

    const coverImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : "";

    const post = await Post.create({
      title,
      content,
      coverImage,
      author: req.user.email,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.log("❌ Create Post Error:", err);
    res.status(500).json({ message: "Error creating post" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log("❌ Fetch Posts Error:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.log("❌ Single Post Error:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
});

app.put("/posts/:id", auth, upload.single("coverImage"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot edit this post" });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://blog-backend-rn0w.onrender.com"
        : "http://localhost:5000";

    const coverImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : post.coverImage;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        coverImage,
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.log("❌ Update Post Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.log("❌ Delete Post Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});