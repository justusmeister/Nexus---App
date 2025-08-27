import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Feather";
import { DarkTheme, LightTheme } from "../constants/theme";
import { useThemePreference } from "../hooks/useThemePreference";

const DatePickerModal = React.memo(({
  visible,
  onClose,
  date,
  onDateChange,
  minimumDate,
  title = "Datum wählen",
  noDateOption = false,
  homework = false,
  showResetButton = true, // Default true für Testzwecke
  originalDate = null, // Das ursprüngliche Datum zum Zurücksetzen
}) => {
  const { colorScheme } = useThemePreference();

  const colors = colorScheme == "dark" ? DarkTheme.colors : LightTheme.colors;

  const spacing = { xs: 8, sm: 12, md: 16, lg: 24 };
  const radius = { sm: 4, md: 8, lg: 12 };
  
  const [slideAnim] = useState(new Animated.Value(0));
  const [selectedDate, setSelectedDate] = useState(date);

  // Statische styles
  const styles = useMemo(() => createStyles(), []);

  // Optimierte Quick Actions mit useMemo
  const quickActions = useMemo(() => {
    const baseDate = selectedDate || new Date();
    
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
        label: selectedDate ? 'Tag danach' : 'Morgen',
        icon: 'sun',
        date: dayAfter,
        color: '#F2994A',
      },
      {
        id: 'weekAfter', 
        label: selectedDate ? 'Woche danach' : 'Nächste Woche',
        icon: 'calendar',
        date: weekAfter,
        color: colors.iconBg.success,
      },
    ];

    // Dritte Option: Nächste Stunde nur wenn homework true UND noDateOption false
    if (homework && !noDateOption) {
      actions.push({
        id: 'nextHour',
        label: 'Nächste Stunde',
        icon: 'clock',
        date: nextHour,
        color: colors.primary,
      });
    } else {
      // Sonst nächster Monat
      actions.push({
        id: 'monthAfter',
        label: selectedDate ? 'Monat danach' : 'Nächster Monat',
        icon: 'calendar',
        date: monthAfter,
        color: '#9B51E0',
      });
    }

    return actions;
  }, [selectedDate, homework, noDateOption, colors]);

  // Optimierte Callbacks
  const handleQuickAction = useCallback((actionDate) => {
    setSelectedDate(actionDate);
  }, []);

  const handleNoDate = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedDate(originalDate);
  }, [originalDate]);

  const handleDatePickerChange = useCallback((event, newSelectedDate) => {
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      return;
    }
    if (newSelectedDate) {
      setSelectedDate(newSelectedDate);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    onDateChange(selectedDate);
    onClose();
  }, [selectedDate, onDateChange, onClose]);

  const handleClose = useCallback(() => {
    if (selectedDate !== date) {
      onDateChange(selectedDate);
    }
    // Schnellere Schließ-Animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [selectedDate, date, onDateChange, onClose, slideAnim]);

  // Animation Effects
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

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

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
        <Animated.View style={[styles.overlay, overlayOpacity, { backgroundColor: colorScheme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)" }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, modalTransform, { backgroundColor: colors.background, borderRadius: radius.lg }]}>
              {/* Header */}
              <View style={[styles.header, { marginBottom: spacing.lg }]}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { padding: spacing.xs }]}>
                  <Icon name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Quick Actions - Horizontal ScrollView */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={[styles.quickActionsContainer, { marginBottom: spacing.lg }]}
                contentContainerStyle={styles.quickActionsContent}
              >
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: action.color, borderRadius: radius.md, marginRight: spacing.sm }]}
                    onPress={() => handleQuickAction(action.date)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                      <Icon name={action.icon} size={16} color="#fff" />
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text }]}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
                
                {noDateOption && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.iconBg.neutral, borderRadius: radius.md, marginRight: spacing.sm }]}
                    onPress={handleNoDate}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: colors.iconBg.neutral }]}>
                      <Icon name="x-circle" size={16} color="#fff" />
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text }]}>Kein Datum</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              {/* Reset Button - Separate row if needed */}
              {showResetButton && originalDate && (
                <View style={[styles.resetButtonContainer, { marginBottom: spacing.md }]}>
                  <TouchableOpacity
                    style={[styles.resetButton, { backgroundColor: colors.card, borderColor: colors.iconBg.warning, borderRadius: radius.md }]}
                    onPress={handleReset}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.resetButtonIcon, { backgroundColor: colors.iconBg.warning }]}>
                      <Icon name="rotate-ccw" size={14} color="#fff" />
                    </View>
                    <Text style={[styles.resetButtonText, { color: colors.text }]}>Zurücksetzen</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Divider */}
              <View style={[styles.divider, { marginBottom: spacing.md }]}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Date Picker */}
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={handleDatePickerChange}
                  minimumDate={minimumDate}
                  style={styles.picker}
                  textColor={colors.text}
                  accentColor={colors.primary}
                />
              </View>

              {/* Footer - für Android und bessere UX */}
              {Platform.OS === 'android' && (
                <View style={[styles.footer, { paddingTop: spacing.md, borderTopColor: colors.border, marginTop: spacing.md }]}>
                  <TouchableOpacity 
                    style={[styles.cancelButton, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, marginRight: spacing.sm, paddingVertical: spacing.md + 2, paddingHorizontal: spacing.lg - 4 }]} 
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.text }]}>Abbrechen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md + 2, paddingHorizontal: spacing.lg - 4 }]} 
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

const createStyles = () => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "92%",
    maxWidth: 400,
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    padding: 10,
  },
  title: {
    fontSize: RFPercentage(2.6),
    fontWeight: "700",
  },
  closeButton: {
    // padding wird inline gesetzt
  },
  quickActionsContainer: {
    // marginBottom wird inline gesetzt
  },
  quickActionsContent: {
    paddingRight: 16, // Damit der letzte Button nicht am Rand klebt
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 130, // Feste Breite für einheitliche Darstellung
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  quickActionText: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
    flex: 1,
  },
  resetButtonContainer: {
    alignItems: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resetButtonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: RFPercentage(1.8),
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  pickerContainer: {
    alignItems: "center",
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 280 : 180, // Reduziert für kompakteres Modal
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
  },
  confirmButton: {
    flex: 1,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButtonText: {
    fontSize: RFPercentage(2.1),
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: RFPercentage(2.1),
    color: "#fff",
    fontWeight: "600",
  },
});

DatePickerModal.displayName = 'DatePickerModal';

export default DatePickerModal;