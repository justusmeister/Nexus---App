import React, { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const PlusButton = ({ onPress, small = false, medium = false }) => {
  const { colors } = useTheme();
  let size = small ? 38 : 65;
  size = medium ? 42 : size;
  const borderRadius = small ? 19 : 32; // proportional zur Größe
  

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius,
          opacity: pressed ? 0.6 : 1,
          backgroundColor: colors.primary,
        },
      ]}
      hitSlop={12}
    >
      <Icon.Feather name="plus" size={medium ? 28 : small ? 26 : 28} color={colors.background} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default memo(PlusButton);
