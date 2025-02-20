import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function MediaPickerScreen() {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaType, setMediaType] = useState("all"); // Default: Show All
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  // Fetch Media on Load
  useEffect(() => {
    if (!permission) {
      requestPermission();
    } else if (permission.granted) {
      loadRecentMedia(); // Load only recent media
    }
  }, [permission, mediaType]);

  // Load Recent Media (Sorted by Creation Date)
  const loadRecentMedia = async () => {
    const mediaAssets = await MediaLibrary.getAssetsAsync({
      mediaType: mediaType === "all" ? ["photo", "video"] : mediaType,
      first: 50, // Fetch 50 most recent files
      sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Sort by newest first
    });
    setMedia(mediaAssets.assets);
  };

  // Select or Deselect Media
  const toggleSelection = (item) => {
    setSelectedMedia((prev) =>
      prev.includes(item.uri)
        ? prev.filter((uri) => uri !== item.uri)
        : [...prev, item.uri]
    );
  };

  // Confirm Selection & Navigate to Editor
  const confirmSelection = () => {
    if (selectedMedia.length > 0) {
      router.push({
        pathname: "/editor",
        params: { mediaUris: selectedMedia },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, mediaType === "video" && styles.activeTab]}
          onPress={() => setMediaType("video")}
        >
          <Text
            style={
              mediaType === "video" ? styles.activeTabText : styles.tabText
            }
          >
            VIDEO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mediaType === "photo" && styles.activeTab]}
          onPress={() => setMediaType("photo")}
        >
          <Text
            style={
              mediaType === "photo" ? styles.activeTabText : styles.tabText
            }
          >
            PHOTO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mediaType === "all" && styles.activeTab]}
          onPress={() => setMediaType("all")}
        >
          <Text
            style={mediaType === "all" ? styles.activeTabText : styles.tabText}
          >
            ALL
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media Grid */}
      <FlatList
        data={media}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.mediaItem,
              selectedMedia.includes(item.uri) ? styles.selected : null,
            ]}
            onPress={() => toggleSelection(item)}
          >
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            {selectedMedia.includes(item.uri) && (
              <View style={styles.checkmark}>
                <FontAwesome5 name="check" size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Bottom Confirm Button */}
      {selectedMedia.length > 0 && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmSelection}
        >
          <Text style={styles.confirmText}>
            ✓ Confirm ({selectedMedia.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff3366",
  },
  tabText: {
    fontSize: 16,
    color: "#777",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff3366",
  },
  mediaItem: {
    flex: 1,
    margin: 2,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 100,
  },
  selected: {
    borderWidth: 3,
    borderColor: "#00C853",
  },
  checkmark: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#00C853",
    padding: 5,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#00C853",
    padding: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
