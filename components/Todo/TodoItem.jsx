import React, { useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Checkbox from "../Checkbox";
import { formatDueDateFromTimestamp } from "../../utils/formatDueDate";
import * as Icon from "@expo/vector-icons";

const colorByType = {
  Dringend: "#E07A5F", // Rot
  Demnächst: "#F4A261", // Orange
  Optional: "#3D81B8", // Blau
};

const TodoItem = ({ item, index, onPress, onDelete }) => {
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

  /*function parseToTimestamp(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor(date.getTime() / 1000);
    return { seconds };
  }*/

  // DueDate optional, also evtl. anzeigen
  const formattedDueDate = formatDueDateFromTimestamp(item.dueDate);

  return (
    <Animated.View
      style={[
        styles.todoContainer,
        { transform: [{ scale: activeAnimation === index ? scale : 1 }] },
        {
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.todoBox,
          { borderLeftColor: colorByType[item.typ] || "#000" },
        ]}
      >
        <Checkbox onConfirm={() => onDelete(item.id)} />
        <View style={styles.todoDetails}>
          <Text style={styles.todoText} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          {formattedDueDate /*!== "n.A."*/ && (
            <Text style={styles.dueDateText}>
              Fälligkeit: {formattedDueDate}
            </Text>
          )}
        </View>
        {item.priority > 0 && (
          <Icon.FontAwesome name="exclamation" size={27} color="#D32F2F" />
        )}
        {item.priority > 1 && (
          <Icon.FontAwesome name="exclamation" size={27} color="#D32F2F" />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    width: "auto",
    marginVertical: 6,
    marginHorizontal: 8,
  },
  todoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
  },
  todoDetails: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "center",
  },
  todoText: {
    fontSize: RFPercentage(2.2),
    fontWeight: "700",
    color: "#333",
  },
  dueDateText: {
    marginTop: 8,
    fontSize: RFPercentage(1.9),
    fontWeight: "600",
    color: "grey",
  },
});

export default TodoItem;
