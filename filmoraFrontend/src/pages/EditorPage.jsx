import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import VideoPreview from "../components/VideoPreview";
import TopNav from "../components/TopNav";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function EditorPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <TopNav />
        <div className="flex flex-grow">
          <Sidebar />
          <div className="flex flex-col flex-grow p-4">
            <VideoPreview />
            <Timeline />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
