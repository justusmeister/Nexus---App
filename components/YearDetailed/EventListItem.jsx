import React, { memo } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const EventListItem = memo(
  ({ item, eventTypeColorList, eventTypesList, onPress }) => {
    return (
      <TouchableOpacity
        style={[
          styles.deadlineItem,
          { borderColor: eventTypeColorList[item.eventType] },
        ]}
        onPress={onPress}
      >
        <View style={styles.deadlineContent}>
          <Text
            style={styles.deadlineTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text style={styles.deadlineCategory}>
            {eventTypesList[item.eventType]}
          </Text>
        </View>
        <Text style={styles.deadlineDate}>
          {new Date(item.day).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  deadlineItem: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
    color: "#333",
  },
  deadlineCategory: {
    fontSize: RFPercentage(1.92),
    color: "#777",
  },
  deadlineDate: {
    fontSize: RFPercentage(1.92),
    fontWeight: "500",
    color: "#333",
  },
});
