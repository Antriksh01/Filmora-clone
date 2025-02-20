import ReactPlayer from "react-player";

export default function VideoPreview() {
  return (
    <ReactPlayer
      url="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
      controls
      width="100%"
      height="400px"
    />
  );
}
