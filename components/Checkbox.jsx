import { Alert, StyleSheet, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useRef, useState } from "react";

const Checkbox = function ({ onConfirm, style }) {
  const [isChecked, setIsChecked] = useState(false);
  const checkboxRef = useRef(null);

  const resetCheckbox = () => {
    setIsChecked(false);
  };

  const handlePress = () => {
    setIsChecked(true); // Temporär setzen, um UI-Zustand zu aktualisieren

    Alert.alert(
      "Frist abschließen?",
      "Möchten Sie die Frist wirklich abschließen?",
      [
        {
          text: "Abbrechen",
          onPress: resetCheckbox,
          style: "cancel",
        },
        {
          text: "Bestätigen",
          onPress: () => {
            Promise.resolve(onConfirm())
              .catch((error) => console.error("Fehler in onConfirm():", error))
              .finally(resetCheckbox);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={[styles.checkBox, style]}>
      <BouncyCheckbox
        isChecked={isChecked}
        disableBuiltInState
        onPress={handlePress}
        fillColor="black"
        unfillColor="transparent"
        iconStyle={{ borderColor: "black", borderWidth: 2, }}
        textComponent={<></>}
      />
    </View>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  checkBox: {
    padding: 5,
  },
});
