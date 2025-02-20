import { useState } from "react";
import { useDrag } from "react-dnd";

const MediaItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MEDIA",
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`p-2 border ${isDragging ? "opacity-50" : ""}`}>
      {item.type === "text" ? (
        <p>{item.content}</p>
      ) : (
        <img src={item.src} alt="Media" />
      )}
    </div>
  );
};

export default function MediaSidebar() {
  const [mediaItems] = useState([
    { id: 1, type: "text", content: "Sample Text" },
    { id: 2, type: "image", src: "https://via.placeholder.com/150" },
  ]);

  return (
    <div className="w-1/4 p-4 border-r bg-gray-100">
      {mediaItems.map((item) => (
        <MediaItem key={item.id} item={item} />
      ))}
    </div>
  );
}
