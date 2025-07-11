// routes/blog.ts
const express = require("express");
const BlogPost = require("../models/BlogPost");


const router = express.Router();

// list (pagination optional)
router.get("/", async (req, res) => {
  const posts = await BlogPost.find({ published: true })
    .sort({ createdAt: -1 })
    .select("title slug excerpt coverImage createdAt");
  res.json(posts);
});

// single
// GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;