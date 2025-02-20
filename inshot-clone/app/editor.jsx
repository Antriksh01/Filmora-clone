import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Video } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as ScreenOrientation from "expo-screen-orientation";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export default function VideoEditorScreen() {
  const router = useRouter();
  const { mediaUris } = useLocalSearchParams();
  const mediaArray = mediaUris ? mediaUris.split(",") : [];
  const [currentMedia, setCurrentMedia] = useState(mediaArray[0]);
  const [thumbnails, setThumbnails] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    generateThumbnails();
  }, [currentMedia]);

  const generateThumbnails = async () => {
    try {
      const thumbs = [];
      for (let i = 0; i <= 10; i++) {
        const { uri } = await VideoThumbnails.getThumbnailAsync(currentMedia, {
          time: (i / 10) * 10000,
        });
        thumbs.push(uri);
      }
      setThumbnails(thumbs);
    } catch (error) {
      console.error("Error generating thumbnails", error);
    }
  };

  const seekVideo = async (index) => {
    if (videoRef.current) {
      const seekTime = (index / 10) * videoDuration;
      await videoRef.current.setPositionAsync(seekTime * 1000);
      setPlayheadPosition(index * 10);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullScreen = async () => {
    if (isFullScreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }
    setIsFullScreen(!isFullScreen);
  };

  const undoLastEdit = () => {
    if (editHistory.length > 0) {
      const lastEdit = editHistory.pop();
      setRedoStack([...redoStack, lastEdit]);
      console.log("Undo: ", lastEdit);
    }
  };

  const redoLastEdit = () => {
    if (redoStack.length > 0) {
      const lastRedo = redoStack.pop();
      setEditHistory([...editHistory, lastRedo]);
      console.log("Redo: ", lastRedo);
    }
  };

  const formattedUri = currentMedia.includes("file://")
    ? currentMedia
    : `file://${decodeURIComponent(currentMedia)}`;

  useEffect(() => {
    (async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(formattedUri);
        if (!fileInfo.exists) {
          console.error("❌ Error: File does not exist at path", formattedUri);
          alert("The selected video file is missing or inaccessible.");
        } else {
          console.log("✅ File exists:", formattedUri);
        }
      } catch (error) {
        console.error("❌ File check error:", error);
      }
    })();
  }, [formattedUri]);

  return (
    <View style={styles.container}>
      {/* Top Toolbar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={22} color="white" />
        </TouchableOpacity>
        <FontAwesome5 name="question-circle" size={22} color="white" />
        <Text style={styles.exportText}>Export</Text>
      </View>

      {/* Advertisement Placeholder */}
      <View style={styles.adBanner}>
        <Text style={styles.adText}>Ad Banner</Text>
      </View>

      {/* Video Preview */}
      <View style={styles.mediaPreview}>
        {currentMedia.endsWith(".mp4") ? (
          <Video
            ref={videoRef}
            source={{ uri: formattedUri }}
            style={styles.video}
            resizeMode="contain"
            useNativeControls
            shouldPlay={isPlaying}
          />
        ) : (
          <Image source={{ uri: currentMedia }} style={styles.image} />
        )}
      </View>

      {/* Video Timeline */}
      <View style={styles.timelineContainer}>
        <FlatList
          data={thumbnails}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => seekVideo(index)}
              style={styles.thumbnailWrapper}
            >
              <Image source={{ uri: item }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
        />
        <View style={[styles.playhead, { left: `${playheadPosition}%` }]} />
      </View>

      {/* Toolbar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolbar}
      >
        <TouchableOpacity style={styles.tool} onPress={undoLastEdit}>
          <FontAwesome5 name="undo" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool} onPress={redoLastEdit}>
          <FontAwesome5 name="redo" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool} onPress={togglePlayPause}>
          <FontAwesome5
            name={isPlaying ? "pause" : "play"}
            size={22}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tool} onPress={toggleFullScreen}>
          <FontAwesome5 name="expand" size={22} color="white" />
        </TouchableOpacity>
      </ScrollView>

      {/* Editing Toolbar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolbarTwo}
      >
        {[
          { icon: "cut", label: "Trim" },
          { icon: "redo", label: "Rotate" },
          { icon: "compress", label: "Resize" },
          { icon: "sync-alt", label: "Speed" },
          { icon: "magic", label: "Effects" },
          { icon: "volume-up", label: "Volume" },
          { icon: "music", label: "Add Music" },
          { icon: "font", label: "Text" },
          { icon: "smile", label: "Stickers" },
          { icon: "crop", label: "Crop" },
          { icon: "play-circle", label: "Transitions" },
          { icon: "paint-brush", label: "Background Blur" },
          { icon: "microphone", label: "Voiceover" },
          { icon: "headphones", label: "Sound Effects" },
          { icon: "object-group", label: "PIP" },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.tool}>
            <FontAwesome5 name={item.icon} size={22} color="white" />
            <Text style={styles.toolText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
// Styles
const styles = StyleSheet.create({
  // 📌 Main Container
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  // 📌 Top Bar (Back, Help, Export)
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#000",
  },

  exportText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },

  // 📌 Ad Banner Placeholder
  adBanner: {
    height: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // ✅ Space below banner
  },

  adText: {
    color: "white",
    fontSize: 14,
  },

  // 📌 Video Preview Container
  mediaPreview: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    width: "100%",
    height: 350,
    marginBottom: 10, // ✅ Add spacing before thumbnails
  },

  // 📌 Video Player Styling
  videoContainer: {
    width: "100%",
    height: "100%", // ✅ Ensures proper video size
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },

  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  // 📌 Video Timeline & Thumbnails
  timelineContainer: {
    backgroundColor: "#1e1e1e",
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    // position: "relative",
    paddingHorizontal: 10,
    overflow: "hidden", // ✅ Prevents extra height issues
  },

  thumbnailWrapper: {
    marginHorizontal: 5, // ✅ Add spacing
  },

  thumbnail: {
    width: 50, // ✅ Increased size for better visibility
    height: 50,
    borderRadius: 5,
    marginRight: 5, // ✅ Ensures even spacing
  },

  playhead: {
    width: 2,
    height: 50,
    backgroundColor: "yellow",
    position: "absolute",
    top: 0,
  },

  // 📌 Toolbar for Undo, Redo, Play, Full-Screen
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 0,
    backgroundColor: "#1e1e1e",
    height: 100, // ✅ Ensures proper height
    width: "100%",
    // backgroundColor: "gray",
  },

  tool: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    minWidth: 70,
    height: 50, // ✅ Ensures proper button height
  },

  toolText: {
    fontSize: 12,
    color: "white",
    marginTop: 2,
    textAlign: "center",
  },

  // 📌 Editing Toolbar (Trim, Rotate, Resize, etc.)
  toolbarTwo: {
    flexDirection: "row",
    justifyContent: "space-between", // ✅ Distribute evenly
    paddingVertical: 2,
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#1e1e1e",
    height: 100,
    marginTop: 0,
    // backgroundColor: "#fff101",
  },
});
