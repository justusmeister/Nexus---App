import * as Icon from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Text, StyleSheet, Pressable } from "react-native";

const HeaderStack = function ({ title, onPress }) {
  return (
    <BlurView tint="light" intensity={100} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.backButton,
          { backgroundColor: pressed ? "#e0e0e0" : "#c7c9c8" }, // Hintergrundfarbe basierend auf gedrückt
        ]}
      >
        <Icon.FontAwesome5 name="arrow-left" size={22} />
      </Pressable>
    </BlurView>
  );
};

export default HeaderStack;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    height: 100,
    flexDirection: "row",
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 0.5,
  },
  backButton: {
    position: "absolute",
    left: 25,
    bottom: 10,
    padding: 9,
    paddingBottom: 7,
    paddingTop: 7,
    borderRadius: 10,
  },
  title: {
    marginBottom: 14,
    fontSize: 22,
    fontFamily: "Arial",
    fontWeight: 500,
    fontWeight: "500",
  },
});
