import { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import SingleRadioButton from "./SingleRadioButton";
import { RFPercentage } from "react-native-responsive-fontsize";

const RadioOption = memo(function ({ label, value, onToggle }) {
  return (
    <View style={styles.radioButtonContainer}>
      <Text style={styles.label}>{label}</Text>
      <SingleRadioButton value={value} onPress={onToggle} />
    </View>
  );
});

const styles = StyleSheet.create({
  radioButtonContainer: {
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
});

export default RadioOption;