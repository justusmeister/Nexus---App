import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const formatTime = (ms) => {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
};

const Stopwatch = () => {
  const { colors } = useTheme();
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStartStop = () => {
    animate();
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      const start = Date.now() - time;
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - start);
      }, 10);
    }
  };

  const handleReset = () => {
    animate();
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.time, { color: colors.text }]}>{formatTime(time)}</Text>

      <Animated.View style={[styles.controlRow, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          onPress={handleStartStop}
          style={[
            styles.primaryButton,
            { backgroundColor: running ? colors.card : colors.primary },
            running && { borderWidth: 2, borderColor: colors.warning },
          ]}
        >
          <Feather
            name={running ? "pause" : "play"}
            size={28}
            color={running ? colors.warning : colors.card}
          />
        </Pressable>

        <Pressable
          onPress={handleReset}
          style={[styles.secondaryButton, { backgroundColor: colors.card, shadowColor: colors.border }]}
        >
          <Feather name="rotate-ccw" size={22} color={colors.text} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  time: {
    fontVariant: ["tabular-nums"],
    fontSize: RFPercentage(7),
    fontWeight: "300",
    letterSpacing: 2,
    marginBottom: 30,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  primaryButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 16,
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 8,
  },
});
