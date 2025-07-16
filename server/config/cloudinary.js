const cloudinary = require("cloudinary").v2;
const path = require("path");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagePath = path.join(__dirname, "..", "uploads", "1751958763540.jpeg");

cloudinary.uploader.upload(imagePath, {
  folder: "wanaw-services",
})
  .then((result) => {
    console.log("✅ Upload success!");
    console.log("Image URL:", result.secure_url);
  })
  .catch((err) => {
    console.error("❌ Upload failed:");
    console.error(err);
  });



// If you're exporting cloudinary for use elsewhere, keep this:
module.exports = cloudinary;

