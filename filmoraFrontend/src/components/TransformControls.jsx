import { useState } from "react";

export default function TransformControls() {
  const [size, setSize] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div className="p-4 border">
      <label>Size</label>
      <input
        type="range"
        min="50"
        max="200"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <div>
        <label>Position</label>
        <input
          type="number"
          value={position.x}
          onChange={(e) => setPosition({ ...position, x: e.target.value })}
        />
        <input
          type="number"
          value={position.y}
          onChange={(e) => setPosition({ ...position, y: e.target.value })}
        />
      </div>
    </div>
  );
}
