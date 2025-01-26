import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const SegmentedControl = ({ options = [], selectedOption, onOptionPress }) => {
  const { width: windowWidth } = useWindowDimensions();

  const internalPadding = 10;
  const segmentedControlWidth = windowWidth - 32;

  const itemWidth = (segmentedControlWidth - internalPadding) / options.length;

  const rStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(
        itemWidth * options.indexOf(selectedOption) + internalPadding / 2,
        { duration: 250 }
      ),
    };
  }, [selectedOption, options, itemWidth]);

  return (
    <View
      style={[
        styles.container,
        {
          width: segmentedControlWidth,
          borderRadius: 15,
          paddingLeft: internalPadding / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            width: itemWidth,
          },
          rStyle,
          styles.activeBox,
        ]}
      />
      {options.map((option) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onOptionPress?.(option);
            }}
            key={option}
            style={[
              {
                width: itemWidth,
              },
              styles.labelContainer,
            ]}
          >
            <Text style={styles.label}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    backgroundColor: "lightgrey",
  },
  activeBox: {
    position: "absolute",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    elevation: 3,
    height: "80%",
    top: "10%",
    backgroundColor: "#fff",
  },
  labelContainer: { justifyContent: "center", alignItems: "center" },
  label: {
    fontWeight: "500",
    fontSize: 16,
  },
});

export { SegmentedControl };
