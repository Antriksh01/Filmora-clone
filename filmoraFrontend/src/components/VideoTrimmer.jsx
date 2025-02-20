// src/components/VideoTrimmer.jsx
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoTrimmer = ({ videoUrl, onTrim }) => {
  const playerRef = useRef(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [duration, setDuration] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [dragging, setDragging] = useState(null);

  // Fetch duration once player is ready
  const handleReady = () => {
    if (playerRef.current) {
      const videoDuration = playerRef.current.getDuration();
      if (videoDuration && videoDuration > 0) {
        setDuration(videoDuration);
        setEndTime(videoDuration);
        generateThumbnails(videoDuration);
      }
    }
  };

  // Generate thumbnails when duration is set
  const generateThumbnails = (videoDuration) => {
    const numThumbnails = 10;
    const interval = videoDuration / numThumbnails;
    const newThumbnails = [];

    for (let i = 0; i < numThumbnails; i++) {
      newThumbnails.push({
        time: i * interval,
        url: `${videoUrl}#t=${i * interval}`,
      });
    }

    setThumbnails(newThumbnails);
  };

  // Handle dragging start & end trim points
  const handleMouseDown = (marker) => {
    setDragging(marker);
  };

  const handleMouseMove = (e) => {
    if (!dragging || !thumbnails.length || !duration) return;

    const timeline = e.currentTarget.parentNode;
    const rect = timeline.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;
    const newTime = Math.max(0, Math.min(duration, percent * duration));

    if (dragging === "start" && newTime < endTime) {
      setStartTime(newTime);
      playerRef.current.seekTo(newTime);
    } else if (dragging === "end" && newTime > startTime) {
      setEndTime(newTime);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleTrimSubmit = () => {
    onTrim(startTime, endTime);
  };

  return (
    <div
      className="p-4 bg-gray-900 text-white rounded-lg shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h2 className="text-lg font-bold mb-2">Trim Video</h2>

      {/* Video Player */}
      <div className="relative mb-4 rounded-lg overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          controls
          width="100%"
          height="250px"
          onReady={handleReady}
        />
      </div>

      {/* Thumbnails Timeline with Drag Handles */}
      {thumbnails.length > 0 && (
        <div className="relative bg-gray-800 p-2 rounded-md flex items-center overflow-x-auto space-x-2 border border-gray-600">
          {/* Start Trim Marker */}
          <div
            className="absolute bg-blue-500 w-2 h-12 rounded cursor-ew-resize"
            style={{
              left: `${(startTime / duration) * 100}%`,
            }}
            onMouseDown={() => handleMouseDown("start")}
          ></div>

          {/* Thumbnail Images */}
          {thumbnails.map((thumb, index) => (
            <div key={index} className="relative w-16 h-12 overflow-hidden">
              <img
                src={thumb.url}
                alt={`Frame at ${thumb.time}s`}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          ))}

          {/* End Trim Marker */}
          <div
            className="absolute bg-red-500 w-2 h-12 rounded cursor-ew-resize"
            style={{
              left: `${(endTime / duration) * 100}%`,
            }}
            onMouseDown={() => handleMouseDown("end")}
          ></div>
        </div>
      )}

      {/* Trim Button */}
      <button
        onClick={handleTrimSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
      >
        Trim Video
      </button>
    </div>
  );
};

export default VideoTrimmer;
