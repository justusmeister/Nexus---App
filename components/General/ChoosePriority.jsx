import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const ChoosePriority = ({ priority, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Priorität:</Text>
      <View style={styles.buttonRow}>
        {[0, 1, 2].map((level) => (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            style={[
              styles.button,
              priority === level && styles.activeButton
            ]}
          >
            <View style={styles.iconRow}>
              {level === 0 && (
                <FontAwesome
                  name="minus"
                  size={18}
                  color={priority === level ? "#B71C1C" : "#444"}
                />
              )}
              {level >= 1 &&
                Array.from({ length: level }, (_, i) => (
                  <FontAwesome
                    key={i}
                    name="exclamation"
                    size={18}
                    color={priority === level ? "#B71C1C" : "#444"}
                  />
                ))}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default ChoosePriority;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 14,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#f9d6d6",
  },
  iconRow: {
    flexDirection: "row",
    gap: 2,
  },
});
