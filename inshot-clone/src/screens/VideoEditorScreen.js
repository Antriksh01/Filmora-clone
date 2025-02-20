import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { trimVideo } from "../api/shotstack";

export default function VideoEditorScreen() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);

  // Function to pick a video from gallery
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  // Function to trim the video
  const handleTrim = async () => {
    if (!video) return;
    setLoading(true);

    const trimmedVideo = await trimVideo(video, 0, 10); // Trim first 10 seconds
    setProcessedVideo(trimmedVideo);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Video" onPress={pickVideo} />

      {video && (
        <>
          <Text>Selected Video:</Text>
          <Video
            source={{ uri: video }}
            style={styles.video}
            useNativeControls
          />
          <Button title="Trim Video" onPress={handleTrim} />
        </>
      )}

      {loading && <ActivityIndicator size="large" />}

      {processedVideo && (
        <>
          <Text>Processed Video:</Text>
          <Video
            source={{ uri: processedVideo }}
            style={styles.video}
            useNativeControls
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  video: { width: 300, height: 300, marginTop: 20 },
});
