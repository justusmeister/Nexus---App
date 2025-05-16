import React, { useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Checkbox from "../Checkbox";
import { checkDeadlineRemainingTime } from "../../utils/checkDeadlineRemainingTime";

const DeadlineItem = ({ item, index, onPress, onDelete }) => {
  const [activeAnimation, setActiveAnimation] = useState(null);
  const scale = useState(new Animated.Value(1))[0];
  
  const handlePressIn = () => {
    setActiveAnimation(index);
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 10,
    }).start(() => {
      setActiveAnimation(null);
    });
  };

  const deadlineStatus = checkDeadlineRemainingTime(item.dueDate);
  const isExpired = deadlineStatus.isWithinTwoDays === 0 || deadlineStatus.isWithinTwoDays === -1;
  const isUrgent = deadlineStatus.isWithinTwoDays === 1;

  return (
    <Animated.View
      style={[
        styles.deadlineResult,
        { transform: [{ scale: activeAnimation === index ? scale : 1 }] },
        {
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
          shadowColor: isUrgent ? "#e02225" : "#000",
          shadowOpacity: isUrgent ? 0.8 : 0.1,
          shadowRadius: isUrgent ? 7 : 4,
          opacity: isExpired ? 0.5 : 1,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.deadlineTaskBox}
      >
        <Checkbox onConfirm={() => onDelete(item.id)} />
        <View style={styles.deadlineDetails}>
          <Text style={styles.subjectText}>{item.subject}:</Text>
          <Text
            style={styles.taskText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.task}
          </Text>
          <Text
            style={[
              styles.dueDateText,
              {
                color: isUrgent ? "#e02225" : "grey",
              },
            ]}
          >
            <Text style={styles.dueDateDescriptionText}>Frist endet am:</Text>{" "}
            {item.dueDate}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  deadlineResult: {
    width: "100%",
    marginVertical: 6,
  },
  deadlineTaskBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#e02225",
  },
  deadlineDetails: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 15,
  },
  subjectText: {
    color: "#333",
    fontSize: RFPercentage(2.18),
    fontWeight: "700",
    marginBottom: 10,
  },
  taskText: {
    fontSize: RFPercentage(1.92),
    color: "#666",
    marginBottom: 16,
    flexShrink: 1,
  },
  dueDateText: {
    fontSize: RFPercentage(2.05),
    fontWeight: "700",
    color: "grey",
  },
  dueDateDescriptionText: {
    color: "#333",
    fontSize: RFPercentage(1.92),
    fontWeight: "600",
    marginRight: 10,
  },
});

export default DeadlineItem;