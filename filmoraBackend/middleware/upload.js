const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename file properly
  },
});

// File Filter (Allow Video & Audio)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("audio/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only video and audio files are allowed!"), false);
  }
};

// Upload middleware (500MB limit per file)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit per file
});

module.exports = {
  uploadSingle: upload.single("video"), // Handles single video upload
  uploadMultiple: upload.array("videos", 5), // Handles multiple videos
  uploadMedia: upload.fields([
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
};
