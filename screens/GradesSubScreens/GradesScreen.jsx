import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Button,
  View,
} from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useActionSheet } from "@expo/react-native-action-sheet";

const GradesScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { showActionSheetWithOptions } = useActionSheet();

  const openSheet = () => {
    const options = ["Option 1", "Option 2", "Abbrechen"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Wähle etwas aus",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log("Option 1 gewählt");
        } else if (buttonIndex === 1) {
          console.log("Option 2 gewählt");
        }
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SegmentedControl
        values={["One", "Two"]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      <View style={{ marginTop: 40 }}>
        <Button title="Open Action Sheet" onPress={openSheet} />
      </View>
    </ScrollView>
  );
};

export default GradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
