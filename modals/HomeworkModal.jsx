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
  Platform,
  FlatList,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Icon from "@expo/vector-icons";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { checkDeadlineRemainingTime } from "../utils/checkDeadlineRemainingTime";
import { Timestamp } from "firebase/firestore";
import DatePickerModal from "../components/DatePickerModal";
import ImageViewing from "react-native-image-viewing";

import AttachmentPreview from "../components/General/AttachmentBar/AttachmentPreview";

// Services
import {
  openCamera,
  openGallery,
  openAttachment,
  openNativeFile,
  formatBytes,
  mimeTypeToFeatherIcon,
} from "../components/General/AttachmentBar/utils/attachmentService";
import AddAttachmentDropDownMenu from "../components/Homework/AddAttachmentDropDownMenu";

const HomeworkModal = ({
  visible,
  onClose,
  item,
  color,
  onDelete,
  onUpdate,
  changeStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [status, setStatus] = useState(item?.status);

  const [title, setTitle] = useState(item?.title);
  const [description, setDescription] = useState(item?.description);

  const [multiInputFocused, setMultiInputFocused] = useState(false);
  const titleRef = useRef(null);

  const [dueDate, setDueDate] = useState(new Date());

  const [dueDatePickerVisible, setDueDatePickerVisible] = useState(false);

  useEffect(() => {
    setTitle(item?.title || "");
    setDescription(item?.description || "");
    setDueDate(item?.dueDate);
    if (visible && editing) {
      setEditing(false);
    }
  }, [visible]);

  useEffect(() => {
    setStatus(item?.status);
  }, [item]);

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

    Promise.resolve(onDelete(item?.id))
      .catch((error) => console.error("Fehler beim Löschen:", error))
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    setSaveLoading(true);
    try {
      await onUpdate(title, description, dueDate, item?.id);
    } catch (error) {
      console.error("Fehler beim Update:", error);
    } finally {
      setSaveLoading(false);
      setEditing(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => {
      titleRef?.current.focus();
    }, 50);
  };

  const handleCancel = () => {
    setTitle(item?.title);
    setDescription(item?.description);
    setDueDate(item?.dueDate);
    setEditing(false);
  };

  const handleDescriptionFocus = () => {
    setMultiInputFocused(true);
  };
  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    try {
      if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate();
        return `${String(date.getDate()).padStart(2, "0")}.${String(
          date.getMonth() + 1
        ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
      }

      // Falls der Timestamp schon ein Date-Objekt ist
      if (timestamp instanceof Date) {
        const date = timestamp;
        return `${String(date.getDate()).padStart(2, "0")}.${String(
          date.getMonth() + 1
        ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
      }
      return "";
    } catch (error) {
      console.error("Error while formatting timestamp:", error);
      return "";
    }
  };

  const [attachments, setAttachments] = useState([]);
  const [imageViewerState, setImageViewerState] = useState({
    visible: false,
    currentIndex: 0,
  });

  const imageAttachments = useMemo(
    () => attachments.filter((a) => a.type === "image"),
    [attachments]
  );

  // Attachment handlers
  const handleOpenCamera = useCallback(async () => {
    const newAttachment = await openCamera();
    if (newAttachment) {
      setAttachments((prev) => [...prev, newAttachment]);
    }
  }, []);

  const handleOpenGallery = useCallback(async () => {
    const newAttachment = await openGallery();
    if (newAttachment) {
      setAttachments((prev) => [...prev, newAttachment]);
    }
  }, []);

  const handleOpenAttachment = useCallback(async () => {
    const newAttachment = await openAttachment();
    if (newAttachment) {
      setAttachments((prev) => [...prev, newAttachment]);
    }
  }, []);

  const handleRemoveAttachment = useCallback((indexToRemove) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleAttachmentPress = useCallback(
    (item) => {
      if (item.type === "image") {
        const imageIndex = imageAttachments.findIndex(
          (a) => a.uri === item.uri
        );
        setImageViewerState({
          visible: true,
          currentIndex: imageIndex,
        });
      } else {
        openNativeFile(item.uri);
      }
    },
    [imageAttachments]
  );

  // Rendering
  const renderAttachmentItem = useCallback(
    ({ item, index }) => (
      <AttachmentPreview
        item={item}
        index={index}
        isEditing={editing}
        onPress={() => handleAttachmentPress(item)}
        onRemove={() => handleRemoveAttachment(index)}
      />
    ),
    [handleAttachmentPress, handleRemoveAttachment, editing]
  );

  // Performance optimierungen für FlatList
  const keyExtractor = useCallback((_, index) => `attachment-${index}`, []);
  const getItemLayout = useCallback(
    (_, index) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    []
  );

  const hexToHsla = (hex, alpha = 0.15) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    //RGB in HSL Umwandlung
    (r /= 255), (g /= 255), (b /= 255);
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; //Graustufen
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }

    l = Math.min(0.92, l + 0.25);

    return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%, ${alpha})`;
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, animatedModalStyle]}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Feather
                  name="x-circle"
                  size={30}
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
                <TextInput
                  ref={titleRef}
                  editable={editing}
                  style={[
                    styles.title,
                    styles.inputStyle,
                    editing && styles.underlineInput,
                    editing && { paddingVertical: 6 },
                    { color: color },
                  ]}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={40}
                />
                {!editing ? (
                  <View>
                    <Text style={[styles.dateText, { fontWeight: "700" }]}>
                      Abgabedatum: {formatTimestamp(dueDate)}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.datesEditBox}>
                    <Text style={[styles.dateText, { fontWeight: "700" }]}>
                      Abgabedatum:{" "}
                    </Text>
                    <Pressable
                      onPress={() => setDueDatePickerVisible(true)}
                      style={styles.dateButton}
                      hitSlop={10}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          styles.dateEditingText,
                          { fontWeight: "700" },
                        ]}
                      >
                        {formatTimestamp(dueDate)}
                      </Text>
                    </Pressable>
                  </View>
                )}
                {!editing && (
                  <View style={styles.statusBox}>
                    <Text style={styles.statusText}>Status:</Text>
                    <Icon.FontAwesome
                      name={
                        status
                          ? "check"
                          : checkDeadlineRemainingTime(formatTimestamp(dueDate))
                              .isWithinTwoDays == 0
                          ? "times"
                          : "dot-circle-o"
                      }
                      size={18}
                      color={
                        status
                          ? "#3FCF63"
                          : checkDeadlineRemainingTime(formatTimestamp(dueDate))
                              .isWithinTwoDays == 0
                          ? "#F44336"
                          : "#A0A0A5"
                      }
                    />
                    <Text
                      style={[
                        styles.statusIndicatorText,
                        {
                          color: status
                            ? "#3FCF63"
                            : checkDeadlineRemainingTime(
                                formatTimestamp(dueDate)
                              ).isWithinTwoDays == 0
                            ? "#F44336"
                            : "#A0A0A5",
                        },
                      ]}
                    >
                      {status
                        ? "erledigt"
                        : checkDeadlineRemainingTime(formatTimestamp(dueDate))
                            .isWithinTwoDays == 0
                        ? "abgelaufen"
                        : "ausstehend"}
                    </Text>
                  </View>
                )}
              </View>
              {!status && !editing && (
                <Pressable
                  style={({ pressed }) => [
                    styles.checkButton,
                    { opacity: pressed ? 0.4 : 1 },
                  ]}
                  onPress={() => {
                    setStatus(true);
                    changeStatus(item.id);
                  }}
                >
                  <Icon.FontAwesome size={18} name="check" color="#3FCF63" />
                  <Text style={styles.checkButtonText}>
                    Als erledigt makieren
                  </Text>
                </Pressable>
              )}
              <View style={styles.divider} />
              <ScrollView style={styles.scrollView}>
                <Pressable>
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
                  <View style={styles.dropdown}>
                    {attachments.length > 0 && (
                      <FlatList
                        data={attachments}
                        renderItem={renderAttachmentItem}
                        keyExtractor={keyExtractor}
                        getItemLayout={getItemLayout}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={4}
                        maxToRenderPerBatch={8}
                        windowSize={5}
                        removeClippedSubviews={true}
                        style={styles.attachmentScroll}
                      />
                    )}

                    {editing && (
                      <AddAttachmentDropDownMenu
                        onCamera={handleOpenCamera}
                        onImages={handleOpenGallery}
                        onFiles={handleOpenAttachment}
                      />
                    )}
                  </View>
                </Pressable>
              </ScrollView>
              <View style={styles.buttonsBottomBox}>
                {editing ? (
                  <>
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
                      onPress={() => {
                        handleCancel();
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
                            title === item?.title &&
                            description === item?.description &&
                            dueDate === item?.dueDate
                          )
                        ) {
                          handleUpdate();
                        } else {
                          handleCancel();
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
                        <Icon.Feather
                          name="edit-3"
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
                      disabled={loading ? true : false}
                      onPress={handleDelete}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <View style={styles.deleteButtonSubBox}>
                          <Text style={styles.deleteButtonText}>Löschen</Text>
                          <Icon.Feather
                            name="trash-2"
                            size={25}
                            color="white"
                          />
                        </View>
                      )}
                    </Pressable>
                  </>
                )}
              </View>
              <DatePickerModal
                visible={dueDatePickerVisible}
                onClose={() => setDueDatePickerVisible(false)}
                date={new Date(dueDate)}
                onDateChange={setDueDate}
                title="Abgabedatum wählen"
                homework={true}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <ImageViewing
        animationType="slide"
        images={imageAttachments.map((img) => ({ uri: img.uri }))}
        imageIndex={imageViewerState.currentIndex}
        visible={imageViewerState.visible}
        backgroundColor="white"
        onRequestClose={() =>
          setImageViewerState({ ...imageViewerState, visible: false })
        }
        swipeToCloseEnabled={false}
      />
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
    height: "50%",
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
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 2,
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
  dateText: {
    fontSize: RFPercentage(1.67),
    fontWeight: "400",
    color: "#666",
    marginVertical: 1,
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
  statusBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
    paddingVertical: 3.5,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  statusText: {
    fontSize: RFPercentage(2.05),
    color: "#333",
    fontWeight: "600",
  },
  statusIndicatorText: {
    fontSize: RFPercentage(1.92),
    fontWeight: "600",
  },
  checkButton: {
    flexDirection: "row",
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#D2F8D2",
    padding: 7,
    marginTop: -10,
    marginBottom: 10,
    borderRadius: 8,
  },
  checkButtonText: {
    fontSize: RFPercentage(1.67),
    fontWeight: "600",
    color: "#3FCF63",
  },
  buttonsBottomBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 5,
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
    maxHeight: 120,
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
  dateButton: {
    borderBottomWidth: 1,
    borderColor: "#C7C7CC",
    paddingVertical: 2,
  },
  datesEditBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dateEditingText: {
    color: "#0066cc",
  },
  dropdown: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    padding: 5,
    marginTop: 5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
