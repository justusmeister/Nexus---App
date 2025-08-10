import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import FormField from "../../General/FormField";
import RadioOption from "../../General/RadioOption";
import DateTimeSelector from "../../General/DateTimeSelector";
import EventTypeSelector from "./EventTypeSelector";
import SaveButton from "../../General/SaveButton";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const DeadlineBottomSheet = memo(function ({
  sheetRef,
  titleInputRef,
  selectedDay = new Date(),
  addAppointment,
}) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(selectedDay || new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Klausur");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [activeField, setActiveField] = useState(null);
  const scrollViewRef = useRef(null);

  const segmentedValues = ["Zeitraum", "Event", "Frist"];
  const selectedOption = segmentedValues[selectedIndex];

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
    setDeadlineTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setEventType("Klausur");
    setSelectedIndex(1);
  };

  const toggleIsAllDay = useCallback(() => {
    setIsAllDay((prev) => !prev);
  }, []);

  const appointmentType = useMemo(() => {
    if (selectedOption === "Zeitraum") return 2;
    if (selectedOption === "Frist") return 0;
    return eventType === "Klausur" ? 1 : 2;
  }, [selectedOption, eventType]);

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
      addAppointment(
        deadlineTitle,
        startDate,
        endDate,
        appointmentType,
        description || "-",
        selectedOption === "Zeitraum" ? false : true,
        isAllDay
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
          activeField === "description" &&
            keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={true}
      >
        <FormField
          label="Titel:"
          value={deadlineTitle}
          setValue={setDeadlineTitle}
          placeholder="Titel"
          maxLength={40}
          onFocus={handleTitleFocus}
          onBlur={handleInputBlur}
          inputRef={titleInputRef}
        />

        {selectedOption !== "Zeitraum" && selectedOption !== "Frist" && (
          <RadioOption
            label="Als Frist speichern?"
            value={isAllDay}
            onToggle={toggleIsAllDay}
          />
        )}

        {selectedOption === "Event" && (
          <EventTypeSelector
            eventType={eventType}
            setEventType={setEventType}
          />
        )}

        <DateTimeSelector
          label={
            selectedOption !== "Zeitraum" ? "Fälligkeitsdatum:" : "Startdatum:"
          }
          date={startDate}
          setDate={setStartDate}
          dateType="start"
        />

        {selectedOption === "Zeitraum" && (
          <DateTimeSelector
            label="Enddatum:"
            date={endDate}
            setDate={setEndDate}
            minimumDate={startDate}
            dateType="end"
          />
        )}

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

export default DeadlineBottomSheet;

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
