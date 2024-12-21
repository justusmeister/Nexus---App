import { TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useState } from "react";

const Checkbox = function ({ onConfirm, style }) {
  const [isActivated, setIsActivated] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.checkBox, style]}
      onPress={() => {
        Alert.alert(
          "Frist abschließen?",
          "Möchten Sie die Frist wirklich abschließen?",
          [
            {
              text: "Abbrechen",
              onPress: () => setIsActivated(false),
            },
            {
              text: "Bestätigen",
              onPress: () => {
                onConfirm();
                setIsActivated(false);
              },
              style: "destructive",
            },
          ]
        );
        setIsActivated(!isActivated);
      }}
    >
      <Icon.MaterialIcons
        name={isActivated ? "check-box" : "check-box-outline-blank"}
        size={24}
        color="black"
      />
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  checkBox: {
    padding: 5,
  },
});
