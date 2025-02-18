const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  trimVideoProcess,
  mergeVideosProcess,
  addTextProcess,
  applyFilterProcess,
  addMusicInVideos,
} = require("../controllers/videoController");
const {
  uploadSingle,
  uploadMultiple,
  uploadMedia,
} = require("../middleware/upload");

const router = express.Router();

router.post("/upload", uploadSingle, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded!" });
  }
  res.json({ message: "Video uploaded successfully!", file: req.file });
});

router.post("/trim-videos", uploadSingle, trimVideoProcess);
router.post("/merge-videos", uploadMultiple, mergeVideosProcess);
router.post("/add-text-process", uploadSingle, addTextProcess);
router.post("/apply-filter", uploadSingle, applyFilterProcess);
router.post("/add-music", uploadMedia, addMusicInVideos);

module.exports = router;
