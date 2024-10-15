import { View, Text, StyleSheet, Pressable } from "react-native";

const MessageBox = function ({ style, onPress }) {
  return <Pressable style={[styles.boxSize, style]} onPress={onPress} />;
};

export default MessageBox;

const styles = StyleSheet.create({
  boxSize: {
    width: "85%",
    height: "29%",
  },
});
