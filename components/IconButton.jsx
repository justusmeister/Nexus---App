import { StyleSheet, Pressable } from "react-native";

const IconButton = function ({ style, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.boxSize, style]}></Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  boxSize: {
    width: "50",
    height: "50%",
    backgroundColor: "black",
  },
});
