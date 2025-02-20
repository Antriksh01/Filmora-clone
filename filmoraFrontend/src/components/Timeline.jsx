import { useDrop } from "react-dnd";

export default function Timeline() {
  const [, drop] = useDrop(() => ({
    accept: "MEDIA",
    drop: (item) => console.log("Dropped item:", item.id),
  }));

  return (
    <div ref={drop} className="h-20 border bg-gray-200">
      Timeline
    </div>
  );
}
