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

// SVGs
import SystemModeIcon from "../assets/illustrations/systemmode.svg";
import LightModeIcon from "../assets/illustrations/lightmode.svg";
import DarkModeIcon from "../assets/illustrations/darkmode.svg";

// Neues Radio Icon
import SingleRadioButton from "../components/General/SingleRadioButton";
import { useThemePreference } from "../hooks/useThemePreference";

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
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="#333" />
              </Pressable>

              <View style={styles.header}>
                <Feather name="moon" size={22} color="#4a4a4a" />
                <Text style={styles.headerText}>Darstellung wählen</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.body}>
                {/* System Mode */}
                <Pressable
                  style={styles.option}
                  onPress={() => handleModeChange("system")}
                >
                  <SystemModeIcon width={90} height={90} />
                  <Text style={styles.optionText}>System</Text>
                  <SingleRadioButton
                    value={selectedMode === "system"}
                    onPress={() => handleModeChange("system")}
                  />
                </Pressable>

                {/* Light Mode */}
                <Pressable
                  style={styles.option}
                  onPress={() => handleModeChange("light")}
                >
                  <LightModeIcon width={90} height={90} />
                  <Text style={styles.optionText}>Hell</Text>
                  <SingleRadioButton
                    value={selectedMode === "light"}
                    onPress={() => handleModeChange("light")}
                  />
                </Pressable>

                {/* Dark Mode */}
                <Pressable
                  style={styles.option}
                  onPress={() => handleModeChange("dark")}
                >
                  <DarkModeIcon width={90} height={90} />
                  <Text style={styles.optionText}>Dunkel</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#ffffff",
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
    fontWeight: "700",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
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
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  optionText: {
    flex: 1,
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },
});
