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
import { RFPercentage } from "react-native-responsive-fontsize";

const SegmentedControl = ({
  options = [],
  selectedOption,
  onOptionPress,
  width,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const internalPadding = 38 * 0.13;
  const segmentedControlWidth = windowWidth - (width || 32);

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
          borderRadius: 10,
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
    height: 35,
    backgroundColor: "lightgrey",
  },
  activeBox: {
    position: "absolute",
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    elevation: 3,
    height: "86%",
    top: "7%",
    backgroundColor: "#fff",
  },
  labelContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "500",
    fontSize: RFPercentage(2.18),
  },
});

export { SegmentedControl };
