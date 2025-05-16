import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import { checkDeadlineRemainingTime } from "../utils/checkDeadlineRemainingTime";

const DeadlineInformationModal = ({ visible, task, onClose, onConfirm }) => {
    const dueDate = task !== null ? task.dueDate : "01.01.2000";
    const taskText =
      task !== null ? task.task : "Aufgabe konnte nicht geladen werden";
  
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
                <View style={styles.modalHeader}>
                  <Text style={styles.deadlineModalTitle}>
                    Verbleibende Zeit:
                  </Text>
                  <Text style={styles.remainingTimeText}>
                    {checkDeadlineRemainingTime(dueDate).time}
                  </Text>
                  <Text style={styles.motivationText}>
                    {checkDeadlineRemainingTime(dueDate).isWithinTwoDays === 1
                      ? "Du hast nicht mehr viel Zeit, bleib am Ball!"
                      : checkDeadlineRemainingTime(dueDate).isWithinTwoDays === 2
                      ? "Du schaffst das!"
                      : "Nächstes mal schaffst du es bestimmt!"}
                  </Text>
                </View>
                <View style={styles.divider} />
                <ScrollView>
                  <Pressable>
                    <Text style={styles.taskTextHeader}>Beschreibung:</Text>
                    <Text style={styles.taskText}>{taskText}</Text>
                  </Pressable>
                </ScrollView>
                <View style={styles.finishButtonView}>
                  <Pressable
                    style={styles.finishButton}
                    onPress={() => {
                      onClose();
                      Alert.alert(
                        "Frist abschließen?",
                        "Möchten Sie die Frist wirklich abschließen?",
                        [
                          {
                            text: "Abbrechen",
                          },
                          {
                            text: "Bestätigen",
                            onPress: () => {
                              onConfirm(task.id);
                            },
                            style: "destructive",
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.finishButtonText}>Abschließen</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  export default DeadlineInformationModal;


  const styles = StyleSheet.create({
    taskText: {
      fontSize: RFPercentage(1.92),
      color: "#666",
      marginBottom: 16,
      flexShrink: 1,
    },
    dueDateText: {
      fontSize: RFPercentage(2.05),
      fontWeight: "700",
      color: "grey",
    },
    dueDateDescriptionText: {
      color: "#333",
      fontSize: RFPercentage(1.92),
      fontWeight: "600",
      marginRight: 10,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "85%",
      height: "40%",
      backgroundColor: "#fff",
      borderRadius: 14,
      padding: 15,
      position: "relative",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      position: "absolute",
      top: 7,
      right: 7,
      zIndex: 1,
    },
    closeButtonText: {
      fontSize: RFPercentage(3.21),
      color: "#4A90E2",
    },
    modalHeader: {
      marginBottom: 10,
      backgroundColor: "#fceded",
      padding: 10,
      borderRadius: 8,
    },
    deadlineModalTitle: {
      fontWeight: "700",
      fontSize: RFPercentage(2.18),
      color: "#333",
    },
    remainingTimeText: {
      fontSize: RFPercentage(2.05),
      fontWeight: "600",
      color: "#d13030",
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
    bodyContainer: {
      flex: 1,
    },
    finishButtonView: {
      justifyContent: "center",
      alignItems: "flex-end",
    },
    finishButton: {
      width: 120,
      height: 40,
      backgroundColor: "#0066cc",
      borderRadius: 15,
      marginBottom: 12,
      justifyContent: "center",
      alignItems: "center",
      margin: 3,
    },
    finishButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: RFPercentage(1.92),
    },
    taskTextHeader: {
      fontSize: RFPercentage(1.92),
      fontWeight: "600",
      color: "#333",
      marginBottom: 10,
    },
  });
  