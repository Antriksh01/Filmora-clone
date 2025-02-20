// src/components/UploadVideo.jsx
import React from "react";

const UploadVideo = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    if (files.length > 0) {
      console.log("Selected files:", files);
      onUpload(files); // Pass files to parent (Editor.jsx)
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border-dashed border-2 border-gray-500 rounded-lg">
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        Upload Videos
      </label>
    </div>
  );
};

export default UploadVideo;
