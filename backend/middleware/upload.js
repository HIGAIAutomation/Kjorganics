// middleware/multer.js
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // keep files in memory

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
