import React, { memo } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";

const PlusButton = ({ onPress, small = false }) => {
  const size = small ? 38 : 65;

  return (
    <View style={styles.bgColor}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity: pressed ? 0.4 : 1,
            backgroundColor: "rgba(0, 122, 255, 0.15)",
          },
        ]}
      >
        <Icon.Feather name="plus" size={small ? 26 : 28} color={"#333"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  bgColor: {
    backgroundColor: "#EFEEF6",
    borderRadius: 50,
    shadowColor: "darkgray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default memo(PlusButton);
