// middleware/uploadImages.js
const multer = require("multer");
const path = require("path");

// Destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // e.g. product-1623456789123.jpg
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  },
});

// File filter: only accept jpg/jpeg/png
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg and .png formats are allowed"), false);
  }
};

// Max size: 5MB per file
const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
