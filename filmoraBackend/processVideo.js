const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const os = require("os");

const formatPathForFFmpeg = (filePath) => {
  return filePath.replace(/\\/g, "/"); // Convert backslashes to forward slashes
};

// Trim Video Function
const trimVideo = (inputPath, outputPath, startTime, duration) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime) // Start time in seconds
      .setDuration(duration) // Duration in seconds
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
};

const mergeVideos = (inputFiles, outputPath) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg();

    // Add each video to the FFmpeg input
    inputFiles.forEach((file) => {
      ffmpegCommand.input(file);
    });

    ffmpegCommand
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .mergeToFile(outputPath, "temp/")
      .run();
  });
};

const addTextOverlay = (inputPath, outputPath, text) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(
        `drawtext=text='${text}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2`
      )
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
};

const applyVideoFilter = (inputPath, outputPath, filter) => {
  return new Promise((resolve, reject) => {
    let filterCommand = "";

    // Define filter options
    switch (filter) {
      case "grayscale":
        filterCommand = "format=gray";
        break;
      case "sepia":
        filterCommand =
          "colorchannelmixer=.393:.769:.189:.349:.686:.168:.272:.534:.131";
        break;
      case "blur":
        filterCommand = "boxblur=10:5";
        break;
      default:
        return reject(new Error("Invalid filter option"));
    }

    ffmpeg(inputPath)
      .videoFilters(filterCommand)
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
};

const addBackgroundMusic = (videoPath, musicPath, outputPath, volume) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath) // Video input
      .input(musicPath) // Audio input
      .complexFilter([
        `[1:a]volume=${volume}[a1]`, // Adjust audio volume
        `[0:a][a1]amix=inputs=2:duration=first[a]`, // Mix original and background audio
      ])
      .outputOptions([
        "-map 0:v", // Keep original video
        "-map [a]", // Use mixed audio
        "-c:v copy", // Keep original video codec
        "-c:a aac", // Set audio codec to AAC
        "-strict experimental", // Allow AAC encoding
      ])
      .output(outputPath)
      .on("end", () => {
        console.log("FFmpeg processing finished!");
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      })
      .run();
  });
};

module.exports = {
  trimVideo,
  mergeVideos,
  addTextOverlay,
  applyVideoFilter,
  addBackgroundMusic,
};
