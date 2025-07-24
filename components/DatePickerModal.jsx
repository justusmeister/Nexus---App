import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Feather";

const DatePickerModal = React.memo(({
  visible,
  onClose,
  date,
  onDateChange,
  minimumDate,
  title = "Datum wählen",
  noDateOption = false,
  homework = false,
}) => {
  const [slideAnim] = useState(new Animated.Value(0));

  // Optimierte Quick Actions mit useMemo
  const quickActions = useMemo(() => {
    const baseDate = date || new Date();
    
    const dayAfter = new Date(baseDate);
    dayAfter.setDate(baseDate.getDate() + 1);
    
    const weekAfter = new Date(baseDate);
    weekAfter.setDate(baseDate.getDate() + 7);
    
    const monthAfter = new Date(baseDate);
    monthAfter.setMonth(baseDate.getMonth() + 1);
    
    const nextHour = new Date(baseDate);
    nextHour.setHours(baseDate.getHours() + 1);

    const actions = [
      {
        id: 'dayAfter',
        label: date ? 'Tag danach' : 'Morgen',
        icon: 'sun',
        date: dayAfter,
        color: '#FF6B35',
      },
      {
        id: 'weekAfter', 
        label: date ? 'Woche danach' : 'Nächste Woche',
        icon: 'calendar',
        date: weekAfter,
        color: '#4ECDC4',
      },
    ];

    // Dritte Option: Nächste Stunde nur wenn homework true UND noDateOption false
    if (homework && !noDateOption) {
      actions.push({
        id: 'nextHour',
        label: 'Nächste Stunde',
        icon: 'clock',
        date: nextHour,
        color: '#45B7D1',
      });
    } else {
      // Sonst nächster Monat
      actions.push({
        id: 'monthAfter',
        label: date ? 'Monat danach' : 'Nächster Monat',
        icon: 'calendar',
        date: monthAfter,
        color: '#9B59B6',
      });
    }

    return actions;
  }, [date, homework, noDateOption]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }).start();
    }
  }, [visible, slideAnim]);

  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleQuickAction = (actionDate) => {
    setSelectedDate(actionDate);
    // Modal bleibt offen, damit User die Auswahl sehen kann
  };

  const handleNoDate = () => {
    setSelectedDate(null);
    // Modal bleibt offen für weitere Interaktion
  };

  const handleDatePickerChange = (event, newSelectedDate) => {
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      return;
    }
    if (newSelectedDate) {
      setSelectedDate(newSelectedDate);
    }
  };

  const handleConfirm = () => {
    onDateChange(selectedDate);
    onClose();
  };

  const handleClose = () => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    // Animation zum Schließen starten - schneller und direkter
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const modalTransform = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
      {
        scale: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
    opacity: slideAnim,
  };

  const overlayOpacity = {
    opacity: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, overlayOpacity]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, modalTransform]}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Icon name="x" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActionsContainer}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.quickActionButton, { borderColor: action.color }]}
                    onPress={() => handleQuickAction(action.date)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                      <Icon name={action.icon} size={18} color="#fff" />
                    </View>
                    <Text style={styles.quickActionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
                
                {noDateOption && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, { borderColor: '#8E8E93' }]}
                    onPress={handleNoDate}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: '#8E8E93' }]}>
                      <Icon name="x-circle" size={18} color="#fff" />
                    </View>
                    <Text style={styles.quickActionText}>Kein Datum</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
              </View>

              {/* Date Picker */}
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={handleDatePickerChange}
                  minimumDate={minimumDate}
                  themeVariant="light"
                  style={styles.picker}
                />
              </View>

              {/* Footer - nur für Android */}
              {Platform.OS === 'android' && (
                <View style={styles.footer}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Abbrechen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.confirmButtonText}>Bestätigen</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "92%",
    maxWidth: 400,
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: RFPercentage(2.8),
    fontWeight: "700",
    color: "#1C1C1E",
  },
  closeButton: {
    padding: 4,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  quickActionText: {
    fontSize: RFPercentage(2.2),
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: RFPercentage(2.0),
    color: "#8E8E93",
    fontWeight: "500",
  },
  pickerContainer: {
    alignItems: "center",
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 320 : 200,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButtonText: {
    fontSize: RFPercentage(2.3),
    color: "#007AFF",
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: RFPercentage(2.3),
    color: "#fff",
    fontWeight: "600",
  },
});

export default DatePickerModal;