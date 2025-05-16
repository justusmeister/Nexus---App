import React, { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";

const PlusButton = ({ onPress, small = false }) => {
  const size = small ? 38 : 65;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: pressed ? 0.4 : 1,
          backgroundColor: small ? "#4A90E2" : "rgba(0, 122, 255, 0.15)",
        },
      ]}
    >
      <Icon.Feather name="plus" size={small ? 24 : 28} color={small ? "white" : "#333"} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    borderWidth: 1,
    borderColor: "#d0d0d0",
    shadowColor: "darkgray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default memo(PlusButton);
