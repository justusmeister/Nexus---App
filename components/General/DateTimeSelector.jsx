import { memo, useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import DatePickerModal from "../DatePickerModal";

const DateTimeSelector = memo(function ({
  label,
  date,
  setDate,
  minimumDate = undefined,
  dateType = "start",
  homework = false,
  noDateOption = false,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDateChange = useCallback(
    (selectedDate) => {
      setDate(selectedDate);
      handleClose();
    },
    [setDate, handleClose]
  );

  return (
    <View style={styles.dateTimeContainer}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.dateButton} onPress={showModal}>
        <Text style={styles.dateText}>
          {date ? date.toLocaleDateString() : "Kein Datum"}
        </Text>
        <Icon.Feather name="calendar" size={20} color="#fff" style={styles.icon} />
      </Pressable>

      <DatePickerModal
        visible={modalVisible}
        onClose={handleClose}
        date={date}
        onDateChange={handleDateChange}
        minimumDate={minimumDate}
        homework={homework}
        originalDate={date}
        noDateOption={noDateOption}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  dateTimeContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
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
});

export default DateTimeSelector;
