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

const eventTypesList = ["Frist", "Klausur", "Event"];
const eventTypeColorList = ["#656565", "#E5B800", "#A568E0"];
const eventTypeBackgroundColorList = ["#F2F2F2", "#FFF9E5", "#F7EDFF"];

const AppointmentModal = ({ visible, onClose, item, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const singleEvent = item?.endDate ? false : true;

    Promise.resolve(onDelete(singleEvent, item?.id))
      .catch((error) => console.error("Fehler beim Löschen:", error))
      .finally(() => setLoading(false));
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
                      eventTypeBackgroundColorList[item?.eventType],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { color: eventTypeColorList[item?.eventType] },
                  ]}
                >
                  {item?.name}
                </Text>
                <Text style={styles.remainingTimeText}>
                  {eventTypesList[item?.eventType]}
                </Text>
                <Text style={styles.motivationText}>
                  Datum:{" "}
                  {new Date(item?.day).toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
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

export default AppointmentModal;

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
