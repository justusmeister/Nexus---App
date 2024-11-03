import { useState } from "react";
import * as Icon from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Text, StyleSheet, Pressable } from "react-native";

const HeaderSettings = function ({ title, settingsOnPress }) {
  const [iconPressColor, setIconPressColor] = useState("black");

  return (
    <BlurView
      tint="light"
      intensity={100}
      style={[styles.container, { height: 70 }]}
    >
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onPress={settingsOnPress}
        onPressIn={() => setIconPressColor("#666666")}
        onPressOut={() => setIconPressColor("#4a4a4a")}
        style={{
          marginBottom: 10,
          marginRight: 25,
          padding: 9,
          backgroundColor: "#c7c9c8",
          borderRadius: 50,
        }}
      >
        <Icon.Fontisto name="close-a" size={15} color={iconPressColor} />
      </Pressable>
    </BlurView>
  );
};

export default HeaderSettings;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    position: "relative",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 0.5,
  },
  title: {
    marginBottom: 10,
    marginLeft: 25,
    fontSize: 26,
    fontWeight: "500",
  },
});
