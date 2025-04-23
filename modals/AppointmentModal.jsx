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
  TextInput,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Icon from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";

const eventTypesList = ["Frist", "Klausur", "Event"];
const eventTypeColorList = ["#656565", "#E5B800", "#A568E0"];
const eventTypeBackgroundColorList = ["#F2F2F2", "#FFF9E5", "#F7EDFF"];

const AppointmentModal = ({ visible, onClose, item, onDelete, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(item?.name);
  const [description, setDescription] = useState(item?.description);

  const [multiInputFocused, setMultiInputFocused] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    setTitle(item?.name || "");
    setDescription(item?.description || "");
    setTimeout(() => {
      setEditing(false);
    }, 250);
  }, [visible]);

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withSpring(multiInputFocused ? 150 : 0, {
        damping: 15,
        stiffness: 100,
        mass: 1,
        easing: Easing.ease,
      }),
    };
  });

  const handleDelete = async () => {
    setLoading(true);

    const singleEvent = item?.endDate ? false : true;

    Promise.resolve(onDelete(singleEvent, item?.id))
      .catch((error) => {
        console.error("Fehler beim Löschen:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    setSaveLoading(true);

    Promise.resolve(onUpdate(title, description, item?.eventCategory, item?.id))
      .catch((error) => {
        console.error("Fehler beim Löschen:", error);
        setSaveLoading(false);
        setEditing(false);
      })
      .finally(() => {
        setSaveLoading(false);
        setEditing(false);
      });
  };

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => {
      titleRef?.current.focus();
    }, 50);
  };

  const handleDescriptionFocus = () => {
    setMultiInputFocused(true);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, animatedModalStyle]}>
              {editing ? (
                <View style={styles.editIcon}>
                  <Text style={styles.editText}>[ Bearbeitungsmodus ]</Text>
                </View>
              ) : null}
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
                <TextInput
                  ref={titleRef}
                  editable={editing}
                  style={[
                    styles.title,
                    styles.inputStyle,
                    editing && styles.underlineInput,
                    editing && { paddingVertical: 6 },
                    { color: eventTypeColorList[item?.eventType] },
                  ]}
                  value={title}
                  onChangeText={setTitle}
                />

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
                <TextInput
                  style={[
                    styles.taskText,
                    styles.inputStyle,
                    editing && styles.underlineInput,
                    editing && { paddingVertical: 6 },
                  ]}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                  value={description}
                  onChangeText={setDescription}
                  editable={editing}
                  onFocus={handleDescriptionFocus}
                  onBlur={() => setMultiInputFocused(false)}
                />
              </ScrollView>
              <View style={styles.buttonsBottomBox}>
                {editing ? (
                  <>
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
                      onPress={() => {
                        setTitle(item?.name);
                        setDescription(item?.description);
                        setEditing(false);
                      }}
                    >
                      <Text
                        style={[styles.editButtonsText, { color: "#8E8E93" }]}
                      >
                        Abbrechen
                      </Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
                      onPress={() => {
                        if (
                          !(
                            title === item?.name &&
                            description === item?.description
                          )
                        ) {
                          handleUpdate();
                        } else {
                          console.log("no");
                          console.log(title);
                          console.log(item?.name);
                          console.log(description);
                          console.log(item?.description);
                        }
                      }}
                      disabled={saveLoading}
                    >
                      <Text
                        style={[styles.editButtonsText, { color: "#0066cc" }]}
                      >
                        Speichern
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      style={({ pressed }) => [
                        styles.editButton,
                        { opacity: pressed ? 0.4 : 1 },
                      ]}
                      disabled={loading ? true : false}
                      onPress={handleEdit}
                    >
                      <View style={styles.deleteButtonSubBox}>
                        <Icon.MaterialIcons
                          name="edit"
                          size={22}
                          color="white"
                        />
                      </View>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.deleteButton,
                        { opacity: pressed ? 0.4 : 1 },
                      ]}
                      disabled={loading}
                      onPress={handleDelete}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <View style={styles.deleteButtonSubBox}>
                          <Text style={styles.deleteButtonText}>Löschen</Text>
                          <Icon.MaterialIcons
                            name="delete"
                            size={22}
                            color="white"
                          />
                        </View>
                      )}
                    </Pressable>
                  </>
                )}
              </View>
            </Animated.View>
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
  buttonsBottomBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
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
  editButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "gray",
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
  taskTextHeader: {
    fontWeight: "600",
    marginBottom: 5,
    fontSize: RFPercentage(1.92),
  },
  editButtonsText: {
    fontSize: RFPercentage(2.32),
    fontWeight: "600",
  },
  editableInput: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 6,
    padding: 6,
    minHeight: 38,
  },
  inputStyle: {
    color: "#333",
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderColor: "#C7C7CC",
  },
  taskText: {
    maxHeight: 100,
  },
  editIcon: {
    position: "absolute",
    left: 20,
    top: 2,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  editText: {
    fontWeight: "600",
    color: "black",
  },
});
