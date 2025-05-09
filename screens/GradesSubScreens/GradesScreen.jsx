import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const GradesScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SegmentedControl
        values={["One", "Two"]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
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

