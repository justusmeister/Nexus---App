import { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SegmentedControl } from "../../SegmentedControl";
import { RFPercentage } from "react-native-responsive-fontsize";

const EventTypeSelector = memo(function ({ eventType, setEventType }) {
  const windowWidth = useWindowDimensions().width;
  
  return (
    <View style={styles.eventTypeSelectorContainer}>
      <Text style={styles.label}>Eventtyp:</Text>
      <SegmentedControl
        options={["Klausur", "Event"]}
        selectedOption={eventType}
        onOptionPress={setEventType}
        width={windowWidth / 2}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  eventTypeSelectorContainer: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#333",
  },
});

export default EventTypeSelector;