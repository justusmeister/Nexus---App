import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RFPercentage } from "react-native-responsive-fontsize";

const DatePickerModal = ({
  visible,
  onClose,
  date,
  onDateChange,
  minimumDate,
}) => {

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      {/* Überlagerung */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Modal Content */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Date Picker */}
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={(_, selectedDate) => nDateChange(selectedDate)}
                minimumDate={minimumDate}
                themeVariant="light"
                style={styles.picker}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center", // Zentriert das Modal auf dem Bildschirm
    alignItems: "center", // Zentriert das Modal auf dem Bildschirm
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 10, // Schatten auf Android
    shadowColor: "#000", // Schatten auf iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: "100%",
    marginBottom: 20, // Etwas Abstand nach unten, damit es nicht zu gedrängt aussieht
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: "#f0f0f5", // Helles Grau für den Abbrechen-Button
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#007AFF", // iOS Standardblau für den Bestätigen-Button
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: RFPercentage(2.2),
    color: "#007AFF", // Blau für den Abbrechen-Button
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: RFPercentage(2.2),
    color: "#fff", // Weiße Schrift für den Bestätigen-Button
    fontWeight: "600",
  },
});

export default React.memo(DatePickerModal);
