import { memo } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const SaveButton = memo(function ({ onPress }) {
  return (
    <Pressable style={styles.confirmButton} onPress={onPress}>
      <Text style={styles.buttonText}>Speichern</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: "#0066cc",
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
  },
});

export default SaveButton;