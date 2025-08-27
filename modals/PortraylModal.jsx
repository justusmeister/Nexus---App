import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import {Appearance} from 'react-native';

import SystemModeIcon from "../assets/illustrations/systemmode.svg";
import LightModeIcon from "../assets/illustrations/lightmode.svg";
import DarkModeIcon from "../assets/illustrations/darkmode.svg";

import SingleRadioButton from "../components/General/SingleRadioButton";
import { useThemePreference } from "../hooks/useThemePreference";
import { useTheme } from "@react-navigation/native";

const PortraylModal = ({ visible, onClose }) => {
  const { themePref, setTheme, loading } = useThemePreference();
  const [selectedMode, setSelectedMode] = useState("system");

  useEffect(() => {
    if (!loading && themePref) {
      setSelectedMode(themePref);
    }
  }, [loading, themePref]);

  if (loading) return null;

  const handleModeChange = (value) => {
    setSelectedMode(value);
    setTheme(value);
    Appearance.setColorScheme(value);
  };

  // Theme auswählen
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Feather
                  name="x"
                  size={24}
                  color={theme.colors.text}
                />
              </Pressable>

              <View style={styles.header}>
                <Feather
                  name="moon"
                  size={22}
                  color={theme.colors.text}
                />
                <Text
                  style={[
                    styles.headerText,
                    { color: theme.colors.text, fontFamily: theme.fonts.bold },
                  ]}
                >
                  Darstellung wählen
                </Text>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />

              <View style={styles.body}>
                {/* System Mode */}
                <Pressable
                  style={[
                    styles.option,
                    { backgroundColor: theme.colors.card },
                  ]}
                  onPress={() => handleModeChange("system")}
                >
                  <View style={{ backgroundColor: theme.colors.border, borderRadius: 8, borderLeftWidth: 10, borderBottomWidth: 10, borderColor: theme.colors.border, overflow: "hidden" }}>
                    <SystemModeIcon width={90} height={90} />
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.colors.text, fontFamily: theme.fonts.semibold },
                    ]}
                  >
                    System
                  </Text>
                  <SingleRadioButton
                    value={selectedMode === "system"}
                    onPress={() => handleModeChange("system")}
                  />
                </Pressable>

                {/* Light Mode */}
                <Pressable
                  style={[
                    styles.option,
                    { backgroundColor: theme.colors.card },
                  ]}
                  onPress={() => handleModeChange("light")}
                >
                  <LightModeIcon width={90} height={90} style={{ margin: 5 }}/>
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.colors.text, fontFamily: theme.fonts.semibold },
                    ]}
                  >
                    Hell
                  </Text>
                  <SingleRadioButton
                    value={selectedMode === "light"}
                    onPress={() => handleModeChange("light")}
                  />
                </Pressable>

                {/* Dark Mode */}
                <Pressable
                  style={[
                    styles.option,
                    { backgroundColor: theme.colors.card },
                  ]}
                  onPress={() => handleModeChange("dark")}
                >
                  <DarkModeIcon width={90} height={90} style={{ margin: 5 }}/>
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.colors.text, fontFamily: theme.fonts.semibold },
                    ]}
                  >
                    Dunkel
                  </Text>
                  <SingleRadioButton
                    value={selectedMode === "dark"}
                    onPress={() => handleModeChange("dark")}
                  />
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PortraylModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: RFPercentage(2.4),
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  optionText: {
    flex: 1,
    fontSize: RFPercentage(2),
    marginLeft: 12,
  },
});
