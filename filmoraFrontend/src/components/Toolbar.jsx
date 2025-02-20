import React from "react";

const Toolbar = ({ onAddClip }) => {
  return (
    <div className="w-full flex justify-around p-4 bg-gray-700">
      <button
        className="bg-green-500 px-4 py-2 rounded"
        onClick={() => onAddClip({ type: "Text", content: "Sample Text" })}
      >
        Add Text
      </button>
      <button
        className="bg-blue-500 px-4 py-2 rounded"
        onClick={() =>
          onAddClip({ type: "Image", url: "https://via.placeholder.com/150" })
        }
      >
        Add Image
      </button>
      <button
        className="bg-yellow-500 px-4 py-2 rounded"
        onClick={() =>
          onAddClip({
            type: "Video",
            url: "https://sample-videos.com/video123.mp4",
          })
        }
      >
        Add Video
      </button>
    </div>
  );
};

export default Toolbar;
