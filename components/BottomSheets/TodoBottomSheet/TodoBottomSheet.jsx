import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import ImageViewing from "react-native-image-viewing";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

// Komponenten
import FormField from "../../General/FormField";
import DateTimeSelector from "../../General/DateTimeSelector";
import SaveButton from "../../General/SaveButton";
import ChoosePriority from "../../General/ChoosePriority";
import AttachmentBar from "../../General/AttachmentBar/AttachmentBar";
import AttachmentPreview from "../../General/AttachmentBar/AttachmentPreview";

// Services
import {
  openCamera,
  openGallery,
  openAttachment,
  openNativeFile,
  formatBytes,
  mimeTypeToFeatherIcon,
} from "../../General/AttachmentBar/utils/attachmentService";

const TodoBottomSheet = memo(function ({
  sheetRef,
  titleInputRef,
  addHomework,
}) {
  // State Management
  const [formState, setFormState] = useState({
    isAllDay: true,
    dueDate: new Date(),
    homeworkTitle: "",
    description: "",
    priority: 0,
  });

  const [keyboardState, setKeyboardState] = useState({
    height: 0,
    activeField: null,
  });

  const [attachments, setAttachments] = useState([]);
  const [imageViewerState, setImageViewerState] = useState({
    visible: false,
    currentIndex: 0,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const segmentedValues = ["Dringend", "Demnächst", "Optional"];
  const selectedOption = segmentedValues[selectedIndex];

  // Refs
  const scrollViewRef = useRef(null);

  // Memoized values
  const snapPoints = useMemo(() => ["75%"], []);
  const imageAttachments = useMemo(
    () => attachments.filter((a) => a.type === "image"),
    [attachments]
  );

  // State setters (memoized to prevent re-renders)
  const updateFormState = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateKeyboardState = useCallback((key, value) => {
    setKeyboardState((prev) => ({ ...prev, [key]: value }));
  }, []);

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

  // Keyboard handling
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (event) => {
      const keyboardHeightValue = event.endCoordinates.height;
      updateKeyboardState("height", keyboardHeightValue);

      setTimeout(() => {
        const { activeField } = keyboardState;
        if (activeField === "description") {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        } else if (activeField === "title") {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
      }, 20);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      updateKeyboardState("height", 0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [keyboardState.activeField, updateKeyboardState]);

  // BottomSheet handlers
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleClose = useCallback(() => {
    sheetRef.current?.dismiss();
  }, [sheetRef]);

  const handleDismiss = useCallback(() => {
    setFormState({
      isAllDay: true,
      dueDate: new Date(),
      homeworkTitle: "",
      description: "",
      priority: 0,
    });
    setAttachments([]);
  }, []);

  const handleDescriptionFocus = useCallback(() => {
    updateKeyboardState("activeField", "description");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [updateKeyboardState]);

  const handleInputBlur = useCallback(() => {
    updateKeyboardState("activeField", null);
  }, [updateKeyboardState]);

  const handleSave = useCallback(() => {
    try {
      const { homeworkTitle, dueDate, description, isAllDay, priority } =
        formState;
      addHomework(
        homeworkTitle || "Unbenannt",
        dueDate,
        description || "-",
        isAllDay,
        priority
      );
    } catch (error) {
      console.log(error);
    }
    handleClose();
  }, [formState, addHomework, handleClose]);

  // Rendering
  const renderAttachmentItem = useCallback(
    ({ item, index }) => (
      <AttachmentPreview
        item={item}
        index={index}
        onPress={() => handleAttachmentPress(item)}
        onRemove={() => handleRemoveAttachment(index)}
      />
    ),
    [handleAttachmentPress, handleRemoveAttachment]
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

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      keyboardBehavior="interactive"
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{ backgroundColor: "gray" }}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
    >
      <View style={styles.segmentedControlBox}>
        <SegmentedControl
          values={segmentedValues}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          style={{ height: 32, width: "100%" }}
        />
      </View>
      <BottomSheetScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.sheetContainer,
          keyboardState.activeField === "description" &&
            keyboardState.height > 0 && {
              paddingBottom: keyboardState.height + 20,
            },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={true}
      >
        <FormField
          label="Titel:"
          value={formState.homeworkTitle}
          setValue={(val) => updateFormState("homeworkTitle", val)}
          placeholder="Titel"
          maxLength={40}
          onFocus={() => updateKeyboardState("activeField", "title")}
          onBlur={handleInputBlur}
          inputRef={titleInputRef}
        />

        <ChoosePriority
          priority={formState.priority}
          onChange={(val) => updateFormState("priority", val)}
        />

        <DateTimeSelector
          label="Fälligkeit (optional):"
          date={formState.dueDate}
          setDate={(val) => updateFormState("dueDate", val)}
          dateType="end"
        />

        <AttachmentBar
          onCameraPress={handleOpenCamera}
          onGalleryPress={handleOpenGallery}
          onFilePress={handleOpenAttachment}
          onScanPress={() => console.log("Scan")}
        />

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

        <FormField
          label="Beschreibung:"
          value={formState.description}
          setValue={(val) => updateFormState("description", val)}
          placeholder="Beschreibung hinzufügen..."
          multiline={true}
          numberOfLines={3}
          maxLength={200}
          onFocus={handleDescriptionFocus}
          onBlur={handleInputBlur}
        />

        <SaveButton onPress={handleSave} />
      </BottomSheetScrollView>

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
    </BottomSheetModal>
  );
});

export default TodoBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  attachmentScroll: {
    width: "100%",
    marginBottom: 20,
  },
  segmentedControlBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingVertical: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});
