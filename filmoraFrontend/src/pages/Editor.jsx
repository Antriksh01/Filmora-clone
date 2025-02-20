// src/pages/Editor.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UploadVideo from "../components/UploadVideo";
import VideoEditor from "../components/VideoEditor";

const Editor = () => {
  const [videos, setVideos] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("Trim");

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar onSelectFeature={setSelectedFeature} />
        <div className="w-4/5 p-4">
          <h2 className="text-lg font-semibold mb-2 text-black">
            Feature: {selectedFeature}
          </h2>
          <UploadVideo onUpload={setVideos} /> {/* Updates videos state */}
          {videos.length > 0 && (
            <div className="mt-4">
              {videos.map((video, index) => (
                <VideoEditor
                  key={index}
                  videoUrl={URL.createObjectURL(video)}
                  selectedFeature={selectedFeature}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
