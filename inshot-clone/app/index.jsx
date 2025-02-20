import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import Modal from "react-native-modal"; // Use react-native-modal

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <LinearGradient colors={["#ff9a9e", "#fad0c4"]} style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>PremiumCam</Text>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="crown" size={24} color="black" />
          <FontAwesome5
            name="cog"
            size={24}
            color="black"
            style={{ marginLeft: 15 }}
          />
        </View>
      </View>

      {/* Create New Section */}
      <View>
        <Text style={styles.createNewText}>CREATE NEW</Text>

        {/* Options: Video, Photo, Collage */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={toggleModal}>
            <LinearGradient
              colors={["#ff758c", "#ff7eb3"]}
              style={styles.circleButton}
            >
              <FontAwesome5 name="video" size={32} color="white" />
            </LinearGradient>
            <Text style={styles.optionText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <LinearGradient
              colors={["#fa709a", "#fee140"]}
              style={styles.circleButton}
            >
              <FontAwesome5 name="image" size={32} color="white" />
            </LinearGradient>
            <Text style={styles.optionText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <LinearGradient
              colors={["#fddb92", "#ff758c"]}
              style={styles.circleButton}
            >
              <FontAwesome5 name="columns" size={32} color="white" />
            </LinearGradient>
            <Text style={styles.optionText}>Collage</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {/* New Video Button */}
          <TouchableOpacity
            style={styles.newVideo}
            onPress={() => {
              toggleModal();
              router.push("/media-picker");
            }}
          >
            <Text style={styles.newText}>NEW</Text>
            <FontAwesome5
              name="plus"
              size={20}
              color="white"
              style={styles.plusIcon}
            />
          </TouchableOpacity>

          {/* Draft Video Button */}
          <TouchableOpacity style={styles.draftVideo}>
            <Text style={styles.dateText}>2025-02-19</Text>
            <Text style={styles.timeText}>:22</Text>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>

          {/* Draft Label */}
          <Text style={styles.draftLabel}>1 DRAFT ➤</Text>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full screen
    padding: 10,
    justifyContent: "space-between", // Push content to top & bottom
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3A3A3A",
  },
  iconContainer: {
    flexDirection: "row",
  },
  createNewText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3A3A3A",
    marginBottom: 10,
  },
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  option: {
    alignItems: "center",
  },
  optionText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A3A3A",
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  newVideo: {
    backgroundColor: "#00C853",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  newText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  plusIcon: {
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
  },
  draftVideo: {
    backgroundColor: "white",
    marginTop: 10,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dateText: {
    color: "#888",
    fontSize: 14,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  draftLabel: {
    fontSize: 14,
    color: "#3A3A3A",
    marginTop: 5,
    fontWeight: "bold",
  },
});
