import React, { useState } from "react";
import Timeline from "./Timeline";
import Toolbar from "./Toolbar";
import ExportButton from "./ExportButton";


const VideoEditor = () => {
  const [clips, setClips] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleAddClip = (clip) => {
    setClips([...clips, clip]);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-white">
      <Toolbar onAddClip={handleAddClip} />

      <div className="flex justify-center items-center h-1/2 bg-black">
        {previewUrl ? (
          <video controls src={previewUrl} className="w-3/4" />
        ) : (
          <p>No preview available</p>
        )}
      </div>

      <Timeline clips={clips} />

      <ExportButton clips={clips} setPreviewUrl={setPreviewUrl} />
    </div>
  );
};

export default VideoEditor;
