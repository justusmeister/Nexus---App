import { View, StyleSheet } from "react-native";
import { useState } from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PomodoroTimer from "../../components/Focus/PomodoroTimer";
import StopwatchTimer from "../../components/Focus/StopwatchTimer";
import FullScreenModalHeader from "../../components/General/FullScreenModalHeader";

const FocusScreen = ({ navigation }) => {
  const [mode, setMode] = useState("Pomodoro");

  return (
    <View style={styles.container}>
      <FullScreenModalHeader title="Fokusmodus" onClose={() => navigation.goBack()} />

      <SegmentedControl
        values={["Pomodoro", "Stoppuhr"]}
        selectedIndex={mode === "Pomodoro" ? 0 : 1}
        onChange={(event) => {
          setMode(event.nativeEvent.value);
        }}
        style={styles.segmented}
      />

      <View style={styles.content}>
        {mode === "Pomodoro" ? <PomodoroTimer /> : <StopwatchTimer />}
      </View>
    </View>
  );
};

export default FocusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  segmented: {
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
});
