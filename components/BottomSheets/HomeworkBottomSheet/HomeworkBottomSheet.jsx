import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import FormField from "../../General/FormField";
import DateTimeSelector from "../../General/DateTimeSelector";
import SaveButton from "../../General/SaveButton";
import ChoosePriority from "../../General/ChoosePriority";
import AttachmentBar from "../../General/AttachmentBar";
//import * as ImagePicker from "expo-image-picker";

const HomeworkBottomSheet = memo(function ({
  sheetRef,
  titleInputRef,
  addHomework,
}) {
  const [isAllDay, setIsAllDay] = useState(true);
  const [dueDate, setDueDate] = useState(new Date());
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [activeField, setActiveField] = useState(null);
  const [priority, setPriority] = useState(0);
  const scrollViewRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  /*  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Kamerazugriff wird benötigt.");
      }
    })();
  }, []);*/

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const keyboardHeightValue = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeightValue);

        setTimeout(() => {
          if (activeField === "description") {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          } else if (activeField === "title") {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }
        }, 20);
      }
    );

    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [activeField]);

  const snapPoints = useMemo(() => ["75%"], []);

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

  const handleClose = () => {
    sheetRef.current?.dismiss();
  };

  const handleDismiss = () => {
    setHomeworkTitle("");
    setDescription("");
    setDueDate(new Date());
    setPriority(0);
  };

  const handleTitleFocus = () => {
    setActiveField("title");
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleDescriptionFocus = () => {
    setActiveField("description");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleInputBlur = () => {
    setActiveField(null);
  };

  const handleSave = () => {
    try {
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
  };

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
      <BottomSheetScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.sheetContainer,
          activeField === "description" &&
            keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={true}
      >
        <FormField
          label="Titel:"
          value={homeworkTitle}
          setValue={setHomeworkTitle}
          placeholder="Titel"
          maxLength={40}
          onFocus={handleTitleFocus}
          onBlur={handleInputBlur}
          inputRef={titleInputRef}
        />

        <ChoosePriority priority={priority} onChange={setPriority} />

        <DateTimeSelector
          label="Abgabedatum:"
          date={dueDate}
          setDate={setDueDate}
          dateType="end"
        />

        <AttachmentBar
          onCameraPress={openCamera}
          onGalleryPress={() => console.log("Galerie")}
          onFilePress={() => console.log("Datei")}
          onScanPress={() => console.log("Scan")}
        />

        <FormField
          label="Beschreibung:"
          value={description}
          setValue={setDescription}
          placeholder="Beschreibung hinzufügen..."
          multiline={true}
          numberOfLines={3}
          maxLength={200}
          onFocus={handleDescriptionFocus}
          onBlur={handleInputBlur}
        />

        <SaveButton onPress={handleSave} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default HomeworkBottomSheet;

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
});
