const express = require("express");
const BlogPost = require("../models/BlogPost");
const upload = require("../middleware/upload"); // cover images

const router = express.Router();

/* CREATE ---------------------------------------------------- */
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, content = "", excerpt } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Always publish new posts right away
    const published = true;

    // Slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // If no excerpt provided, take first 150 chars of content
    const finalExcerpt =
      excerpt && excerpt.trim().length
        ? excerpt
        : content.substring(0, 150) + (content.length > 150 ? "…" : "");

    const post = await BlogPost.create({
      title,
      slug,
      excerpt: finalExcerpt,
      content,
      coverImage,
      published,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

/* UPDATE ---------------------------------------------------- */
router.put("/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.coverImage = `/uploads/${req.file.filename}`;
    if (updates.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

/* DELETE ---------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.sendStatus(204);
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;

