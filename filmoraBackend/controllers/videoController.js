const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const {
  trimVideo,
  mergeVideos,
  addTextOverlay,
  applyVideoFilter,
  addBackgroundMusic,
} = require("../processVideo");
const shotstack = require("shotstack-sdk");

const defaultClient = new shotstack.ApiClient();
defaultClient.authentications["DeveloperKey"].apiKey =
  "BkieDHwDa3BX1klRnnOrjMNzpEhJEcEYSI6ef0Fm";

const editApi = new shotstack.EditApi(defaultClient);

dotenv.config();

const PORT = process.env.PORT;

const formatPathForFFmpeg = (filePath) => {
  return `"${path.resolve(filePath).replace(/\\/g, "/")}"`;
};

// Function to sanitize filenames to prevent invalid characters
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
};

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Uploads directory created:", uploadsDir);
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
  }
}

const trimVideoProcess = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded!" });
  }

  const { startTime, duration } = req.body;
  const inputPath = req.file.path; // Uploaded file path
  const outputPath = `uploads/trimmed-${req.file.filename}`;

  try {
    const processedVideo = await trimVideo(
      inputPath,
      outputPath,
      startTime,
      duration
    );
    res.json({ message: "Video trimmed successfully!", file: processedVideo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error processing video", details: error.message });
  }
};

const mergeVideosProcess = async (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: "At least two videos are required!" });
  }

  const inputPaths = req.files.map((file) => file.path);
  const outputPath = `uploads/merged-${Date.now()}.mp4`;

  try {
    const mergedVideo = await mergeVideos(inputPaths, outputPath);
    res.json({ message: "Videos merged successfully!", file: mergedVideo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error merging videos", details: error.message });
  }
};

const addTextProcess = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded!" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required!" });
  }

  const inputPath = req.file.path;
  const outputPath = `uploads/text-overlay-${req.file.filename}`;

  try {
    const processedVideo = await addTextOverlay(inputPath, outputPath, text);
    res.json({ message: "Text added successfully!", file: processedVideo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding text", details: error.message });
  }
};

const applyFilterProcess = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded!" });
  }

  const { filter } = req.body;
  if (!filter) {
    return res.status(400).json({ error: "Filter type is required!" });
  }

  const inputPath = req.file.path;
  const outputPath = `uploads/filtered-${filter}-${req.file.filename}`;

  try {
    const processedVideo = await applyVideoFilter(
      inputPath,
      outputPath,
      filter
    );
    res.json({ message: "Filter applied successfully!", file: processedVideo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error applying filter", details: error.message });
  }
};

const addMusicInVideos = async (req, res) => {
  if (!req.files.video || !req.files.audio) {
    return res
      .status(400)
      .json({ error: "Both video and audio files are required!" });
  }

  const { volume } = req.body;
  const videoPath = req.files.video[0].path;
  const musicPath = req.files.audio[0].path;
  const outputPath = path.resolve(
    __dirname,
    "uploads",
    `music-added-${Date.now()}.mp4`
  );

  console.log("outputpath :", outputPath);

  try {
    const musicVolume = volume ? parseFloat(volume) : 1.0; // Default volume to 100%

    if (musicVolume <= 0 || musicVolume > 5) {
      return res
        .status(400)
        .json({ error: "Volume must be between 0.1 and 5.0" });
    }

    const processedVideo = await addBackgroundMusic(
      videoPath,
      musicPath,
      outputPath,
      musicVolume
    );
    res.json({
      message: "Background music added successfully!",
      file: processedVideo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding music", details: error.message });
  }
};

const shotstackRender = async (req, res) => {
  try {
    const { clips } = req.body;

    const timeline = new shotstack.Timeline();
    const track = new shotstack.Track();

    clips.forEach((clip) => {
      const asset =
        clip.type.toLowerCase() === "video"
          ? new shotstack.VideoAsset()
          : new shotstack.TitleAsset();

      asset.setSrc(clip.url || clip.content);
      asset.setType(clip.type.toLowerCase());

      const videoClip = new shotstack.Clip();
      videoClip.setAsset(asset);
      videoClip.setStart(0);
      videoClip.setLength(5);

      track.addClipsItem(videoClip);
    });

    timeline.setTracks([track]);

    const output = new shotstack.Output();
    output.setFormat("mp4");

    const edit = new shotstack.Edit();
    edit.setTimeline(timeline);
    edit.setOutput(output);

    const response = await editApi.postRender(edit);
    res.json({ id: response.response.id });
  } catch (error) {
    console.error("Error rendering video:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trimVideoProcess,
  mergeVideosProcess,
  addTextProcess,
  applyFilterProcess,
  addMusicInVideos,
  shotstackRender,
};
