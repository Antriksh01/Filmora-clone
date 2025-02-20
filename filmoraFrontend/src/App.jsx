// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ShotstackEditor from "./pages/ShotstackEditor";
import EditorPage from "./pages/EditorPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [video, setVideo] = useState(null);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/editor" element={<Editor video={video} />} />
            <Route path="/ShotstackEditor" element={<ShotstackEditor />} />
          </Routes>
        </Router>
      </DndProvider>
    </>
  );
}

export default App;
