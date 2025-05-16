import {
  useState,
  memo,
} from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PlusButton from "../../components/General/PlusButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const TodosScreen = function () {
  const bottomTabBarHeight = useBottomTabBarHeight();

  const segmentedValues = ["Dringend", "Demnächst", "Optional"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleAddTodo = () => {
    console.log("Add todo");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.segmentedControlBox}>
        <SegmentedControl
          values={segmentedValues}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          style={{ height: 32, width: "100%" }}
        />
      </View>

      <View style={[styles.buttonWrapper, { bottom: bottomTabBarHeight + 5, }]}>
        <PlusButton onPress={handleAddTodo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEEF6",
  },
  segmentedControlBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingVertical: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonWrapper: {
    position: "absolute",
    right: 20,
    alignItems: "center",
    width: 100,
    height: 100
  },
});

export default memo(TodosScreen);
