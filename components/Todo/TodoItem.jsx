import React, { useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { formatDueDateFromTimestamp } from "../../utils/formatDueDate";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Reanimated, { LinearTransition, FadeInRight, FadeOutLeft } from "react-native-reanimated";

const colorByType = {
  Dringend: "#E07A5F", // Rot
  Demnächst: "#F4A261", // Orange
  Optional: "#3D81B8", // Blau
};

const TodoItem = ({ item, index, onPress, onDelete }) => {
  const [activeAnimation, setActiveAnimation] = useState(null);
  const scale = useState(new Animated.Value(1))[0];

  const { colors, fonts } = useTheme();

  const [isChecked, setIsChecked] = useState(false);

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
        <BouncyCheckbox
        isChecked={isChecked}
        disableBuiltInState
        onPress={() => onDelete(item.id)}
        fillColor="black"
        unfillColor="transparent"
        iconStyle={{ borderColor: "black", borderWidth: 2, margin: 5, }}
        textComponent={<></>}
      />
        <View style={styles.todoDetails}>
          <Text style={styles.todoText} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          {formattedDueDate !== "n.A." && (
            <Text style={styles.dueDateText}>
              Fälligkeit: {formattedDueDate}
            </Text>
          )}
        </View>
        {item.priority > 0 && (
          <Icon.FontAwesome name="exclamation" size={27} color={colors.warning} />
        )}
        {item.priority > 1 && (
          <Icon.FontAwesome name="exclamation" size={27} color={colors.warning} />
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
