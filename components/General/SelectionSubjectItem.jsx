import { useRef, memo, useCallback } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const SelectionSubjectItem = memo(function ({ item }) {

  const handlePress = () => {
    console.log(item?.subject);
  };

  return (
    <View style={styles.homeworkButtonBox}>
      <Pressable
        style={[styles.subjectBox, { backgroundColor: item.color }]}
        onPress={handlePress}
      >
        <Icon.FontAwesome name={item.icon} size={16.8} color="white" />
        <Text
          style={styles.subjectText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.subject}
        </Text>
      </Pressable>
    </View>
  );
});

export default SelectionSubjectItem;

const styles = StyleSheet.create({
  subjectBox: {
    width: "auto",
    height: 68,                 // 85 * 0.8
    borderRadius: 20,          // 25 * 0.8
    padding: 12,               // 15 * 0.8
    marginHorizontal: 5,    // 14 * 0.8
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.6 }, // 2 * 0.8
    shadowOpacity: 0.3,
    shadowRadius: 2.4,         // 3 * 0.8
    elevation: 4,              // 5 * 0.8
  },
  subjectText: {
    marginLeft: 12,            // 15 * 0.8
    fontSize: RFPercentage(1.848), // 2.31 * 0.8
    fontWeight: "600",
    color: "white",
  },
  homeworkButtonBox: {
    paddingVertical: 6,        // 7.5 * 0.8
  },
});
