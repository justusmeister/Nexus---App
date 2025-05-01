import { memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const DateTimeSelector = memo(function ({ 
  label, 
  date, 
  setDate, 
  minimumDate = undefined,
  dateType = "start"
}) {
  const showDatePicker = useCallback(() => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        onChange: (event, selectedDate) => {
          if (selectedDate) setDate(selectedDate);
        },
        minimumDate,
      });
    }
  }, [date, setDate, minimumDate]);

  return (
    <View style={styles.dateTimeContainer}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === "ios" ? (
        <View style={styles.iosPickerContainer}>
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => selectedDate && setDate(selectedDate)}
            minimumDate={minimumDate}
            style={styles.iosDatePicker}
          />
        </View>
      ) : (
        <Pressable
          style={styles.dateButton}
          onPress={showDatePicker}
        >
          <Text style={styles.dateText}>
            {date.toLocaleDateString()}
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
});

export default DateTimeSelector;