import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const formatTime = (ms) => {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
};

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleStartStop = () => {
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

  const handleDelete = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(time)}</Text>

      <View style={styles.buttonRow}>
        <Pressable onPress={handleStartStop} style={[styles.iconButton, styles.primary]}>
          <Icon name={running ? "pause" : "play"} size={28} color="#fff" />
        </Pressable>

        <Pressable onPress={handleDelete} style={[styles.button, styles.delete]}>
          <Icon name="delete" size={24} color="#fff"/>
        </Pressable>
      </View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 60,
  },
  time: {
    fontSize: RFPercentage(7),
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "center",
    fontFamily:
      Platform.OS === "ios" ? "Menlo" : Platform.OS === "android" ? "monospace" : "Courier",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  primary: {
    backgroundColor: "#4CAF50",
  },
  delete: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
