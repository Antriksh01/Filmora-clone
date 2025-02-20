// src/components/Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Video Editor</h1>
      <button className="bg-blue-500 px-4 py-2 rounded-lg">Export</button>
    </nav>
  );
};

export default Navbar;
