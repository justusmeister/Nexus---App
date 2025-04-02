import {
  Modal,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";

const HomeworkModal = ({ visible, onClose, item, color, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    Promise.resolve(onDelete(item?.id))
      .catch((error) => console.error("Fehler beim Löschen:", error))
      .finally(() => setLoading(false));
  };

  const formatTimestamp = (timestamp) => {
    if(!timestamp) return;
    const date = timestamp.toDate();
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getFullYear()).slice(2)}`;
  };

  const hexToHsla = (hex, alpha = 0.15) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    //RGB in HSL Umwandlung
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; //Graustufen
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    l = Math.min(0.92, l + 0.25);

    return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${alpha})`;
};
    

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor:
                      color === "#333" ? "#F0F0F0" : hexToHsla(color),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { color: color },
                  ]}
                >
                  {item?.title}
                </Text>
                <Text style={styles.motivationText}>
                  Aufgabedatum: {" "}
                  {formatTimestamp(item?.startDate)}
                </Text>
                <Text style={styles.motivationText}>
                  Abgabedatum: {" "}
                  {formatTimestamp(item?.dueDate)}
                </Text>
              </View>
              <View style={styles.divider} />
              <ScrollView style={styles.scrollView}>
                <Text style={styles.taskTextHeader}>Beschreibung:</Text>
                <Text style={styles.taskText}>{item?.description}</Text>
              </ScrollView>
              <View style={styles.deleteButtonView}>
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    { opacity: pressed ? 0.4 : 1 },
                  ]}
                  disabled={loading ? true : false}
                  onPress={handleDelete}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <View style={styles.deleteButtonSubBox}>
                      <Text style={styles.deleteButtonText}>Löschen</Text>
                      <Icon.MaterialIcons
                        name="delete"
                        size={25}
                        color="white"
                      />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HomeworkModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "40%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalHeader: {
    marginBottom: 15,
    backgroundColor: "#fceded",
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: RFPercentage(2.18),
  },
  remainingTimeText: {
    fontSize: RFPercentage(1.92),
    color: "#333",
  },
  motivationText: {
    fontSize: RFPercentage(1.67),
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  deleteButtonView: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  deleteButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "#d13030",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFPercentage(2.05),
    marginRight: 8,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    height: "auto",
  },
  deleteButtonSubBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
