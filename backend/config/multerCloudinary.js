// Multer and Cloudinary integration for product image uploads
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary storage for product images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 800, crop: "fit", quality: "auto" }],
  },
});

// Multer middleware for handling product image uploads
const upload = multer({ storage });

module.exports = upload;
