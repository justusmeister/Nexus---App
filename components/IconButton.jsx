import { StyleSheet, TouchableOpacity } from "react-native";

const IconButton = function ({ style, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.boxSize, style]}></TouchableOpacity>
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
