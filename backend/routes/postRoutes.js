const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// 🔒 Create Post
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({ title, content });
    await newPost.save();

    res.json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// 📜 Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

module.exports = router;