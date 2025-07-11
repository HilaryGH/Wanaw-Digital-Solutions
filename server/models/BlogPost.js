// models/BlogPost.ts
const mongoose = require("mongoose");
const { Schema } = mongoose;


const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },      // e.g. "ashenda-gift-guide"
    excerpt: { type: String },                    // short preview
    content: { type: String, required: true },    // HTML or Markdown
    coverImage: { type: String },                    // filename or URL
    author: { type: Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);

