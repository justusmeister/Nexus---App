import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Pressable,
  Keyboard,
  Platform,
  Dimensions,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { SegmentedControl } from "./SegmentedControl";
import SingleRadioButton from "./SingleRadioButton";
import { RFPercentage } from "react-native-responsive-fontsize";
import FormalSignleLineInputField from "./FormalSingleLineInputField";

const DeadlineBottomSheet = memo(function ({ sheetRef, addAppointment }) {
  const [selectedOption, setSelectedOption] = useState("Event");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Klausur");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [activeField, setActiveField] = useState(null);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const windowWidth = useWindowDimensions().width;

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
        }, 100);
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

  const snapPoints = useMemo(() => ["75%", "90%"], []);

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

  const showDatePicker = useCallback((mode, date, dateType) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: mode,
        onChange: (event, selectedDate) => {
          if (selectedDate)
            dateType === "due"
              ? setEndDate(selectedDate)
              : setStartDate(selectedDate);
        },
      });
    }
  }, []);

<<<<<<< HEAD
  const handleTitleChange = useCallback((text) => {
    setDeadlineTitle((prev) => (prev === text ? prev : text));
  }, []);

=======
>>>>>>> 2fd5ed764d21446eebfd79dafed4b285395b87df
  const handleDescriptionChange = useCallback((text) => {
    setDescription(text);
  }, []);

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
    >
      <View style={{ paddingHorizontal: 16 }}>
        <SegmentedControl
          options={["Zeitraum", "Event", "Frist"]}
          selectedOption={selectedOption}
          onOptionPress={setSelectedOption}
          style={styles.segmentedControl}
        />
      </View>
      <BottomSheetScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.sheetContainer,
          // Nur Padding hinzufügen, wenn das Beschreibungsfeld aktiv ist
          activeField === "description" &&
            keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Titel:</Text>
<<<<<<< HEAD
          <FormalSignleLineInputField
            style={[
              styles.inputField,
              {
                height: 50,
                borderColor: "#d1d1d6",
                borderWidth: 1,
                borderRadius: 12,
                backgroundColor: "#f9f9f9",
                paddingHorizontal: 16,
                fontSize: 16,
                color: "#333",
              },
            ]}
=======
          <TextInput
            ref={titleInputRef}
            style={styles.inputField}
>>>>>>> 2fd5ed764d21446eebfd79dafed4b285395b87df
            placeholder="Titel"
            defaultValue={deadlineTitle}
            onEndEditing={(e) => setDeadlineTitle(e.nativeEvent.text)}
            onFocus={handleTitleFocus}
            onBlur={handleInputBlur}
          />
        </View>

        {selectedOption !== "Zeitraum" && selectedOption !== "Frist" && (
          <View style={styles.radioButtonContainer}>
            <Text style={styles.label}>Als Frist speichern?</Text>
            <SingleRadioButton value={isAllDay} onPress={toggleIsAllDay} />
          </View>
        )}

        {selectedOption === "Event" ? (
          <View style={styles.eventTypeSelectorContainer}>
            <Text style={styles.label}>Eventtyp:</Text>
            <SegmentedControl
              options={["Klausur", "Event"]}
              selectedOption={eventType}
              onOptionPress={setEventType}
              width={windowWidth / 2}
            />
          </View>
        ) : null}

        <View style={styles.dateTimeContainer}>
          <Text style={styles.label}>
            {selectedOption !== "Zeitraum"
              ? "Fälligkeitsdatum:"
              : "Startdatum:"}
          </Text>
          {Platform.OS === "ios" ? (
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === "ios" ? "default" : "spinner"}
                onChange={(event, date) => date && setStartDate(date)}
                style={styles.iosDatePicker}
              />
            </View>
          ) : (
            <Pressable
              style={styles.dateButton}
              onPress={() => showDatePicker("date", startDate, "due")}
            >
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
              </Text>
              <Icon.Feather
                name="calendar"
                size={20}
                color="#fff"
                style={styles.icon}
              />
            </Pressable>
          )}
        </View>

        {selectedOption === "Zeitraum" ? (
          <View style={styles.dateTimeContainer}>
            <Text style={styles.label}>Enddatum:</Text>
            {Platform.OS === "ios" ? (
              <View style={styles.iosPickerContainer}>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "default" : "spinner"}
                  onChange={(event, date) => date && setEndDate(date)}
                  minimumDate={startDate}
                  style={styles.iosDatePicker}
                />
              </View>
            ) : (
              <Pressable
                style={styles.dateButton}
                onPress={() => showDatePicker("date", endDate, "due")}
              >
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString()}
                </Text>
                <Icon.Feather
                  name="calendar"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
              </Pressable>
            )}
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Beschreibung:</Text>
<<<<<<< HEAD
          <BottomSheetTextInput
=======
          <TextInput
            ref={descriptionInputRef}
>>>>>>> 2fd5ed764d21446eebfd79dafed4b285395b87df
            style={styles.descriptionField}
            placeholder="Beschreibung hinzufügen..."
            multiline
            numberOfLines={3}
            maxLength={200}
            defaultValue={description}
            onEndEditing={(e) => setDescription(e.nativeEvent.text)}
            onFocus={handleDescriptionFocus}
            onBlur={handleInputBlur}
          />
        </View>

        <Pressable
          style={styles.confirmButton}
          onPress={() => {
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
          }}
        >
          <Text style={styles.buttonText}>Speichern</Text>
        </Pressable>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default memo(DeadlineBottomSheet);

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
  segmentedControl: {
    marginBottom: 20,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputField: {
    fontSize: RFPercentage(2.18),
  },
  descriptionField: {
    paddingVertical: 15,
    borderColor: "#d1d1d6",
    borderWidth: 1,
<<<<<<< HEAD
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
=======
    borderColor: "#ddd",
    padding: 12,
    fontSize: RFPercentage(2.18),
    textAlignVertical: "top",
    maxHeight: 100,
>>>>>>> 2fd5ed764d21446eebfd79dafed4b285395b87df
  },
  radioButtonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateTimeContainer: {
    width: "100%",
    marginBottom: 15,
  },
  confirmButton: {
<<<<<<< HEAD
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
=======
    backgroundColor: "#0066cc",
    height: 50,
    borderRadius: 15,
>>>>>>> 2fd5ed764d21446eebfd79dafed4b285395b87df
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
  },
  dateTimeContainer: {
    width: "100%",
    marginBottom: 15,
  },
  iosPickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  iosDatePicker: {
    flex: 1,
  },
  dateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    color: "#fff",
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
  },
  icon: {
    marginLeft: 10,
  },
  eventTypeSelectorContainer: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
