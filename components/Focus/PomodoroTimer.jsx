import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  AppState,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
//import { Audio } from "expo-av";

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("00");
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [customTime, setCustomTime] = useState("25");
  const [shortBreak, setShortBreak] = useState("5");
  const [longBreak, setLongBreak] = useState("15");
  const [activePreset, setActivePreset] = useState("25");

  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const targetTimestamp = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    const loadStoredTime = async () => {
      const stored = await AsyncStorage.getItem("pomodoro_minutes");
      if (stored) {
        setMinutes(stored);
        setCustomTime(stored);
        setActivePreset(stored);
      }
    };
    loadStoredTime();
    requestNotificationPermission();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  const playSound = async () => {
    /*try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/notification.wav") // ⚠️ Stelle sicher, dass du diese Datei hast!
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("Fehler beim Abspielen des Sounds:", error);
    }*/ console.log("sound");
  };

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (running && targetTimestamp.current) {
        const now = Date.now();
        const remaining = Math.max(targetTimestamp.current - now, 0);
        updateTimeDisplay(remaining);
        if (remaining === 0) handleEnd();
      }
    }
    appState.current = nextAppState;
  };

  const updateTimeDisplay = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    setMinutes(String(min).padStart(2, "0"));
    setSeconds(String(sec).padStart(2, "0"));
  };

  const handleStart = async () => {
    await playSound(); // ⏯ Ton beim Start
    const totalMs = parseInt(minutes) * 60 * 1000 + parseInt(seconds) * 1000;
    const endTime = Date.now() + totalMs;
    targetTimestamp.current = endTime;
    setRunning(true);
    await scheduleNotification(totalMs);
    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();
      updateTimeDisplay(remaining);
      if (remaining <= 0) handleEnd();
    }, 1000);
    await AsyncStorage.setItem("pomodoro_minutes", minutes);
  };

  const handleEnd = async () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    updateTimeDisplay(0);
    await playSound(); // 🔔 Ton am Ende

    if (!isBreak) {
      setSessionCount((prev) => prev + 1);
      setBreakCount((prev) => prev + 1);
      if ((breakCount + 1) % 3 === 0) {
        startBreak(parseInt(longBreak));
      } else {
        startBreak(parseInt(shortBreak));
      }
    } else {
      setIsBreak(false);
      selectPreset(parseInt(activePreset));
    }
  };

  const startBreak = (duration) => {
    setIsBreak(true);
    setMinutes(String(duration).padStart(2, "0"));
    setSeconds("00");
    setTimeout(() => handleStart(), 500);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setIsBreak(false);
    setMinutes(activePreset);
    setSeconds("00");
  };

  const scheduleNotification = async (ms) => {
    console.log("Timer gesetzt für ", ms);
  };

  const requestNotificationPermission = async () => {
    const status = true;
    if (status !== "granted") {
      Alert.alert(
        "Benachrichtigungen deaktiviert",
        "Aktiviere sie in den Einstellungen für Timer-Reminder."
      );
    }
  };

  const selectPreset = (min) => {
    if (running) return;
    const val = String(min);
    setMinutes(val.padStart(2, "0"));
    setSeconds("00");
    setActivePreset(val);
    setIsBreak(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sessionText}>
        ✅ Pomodoro-Sessions: {sessionCount}
      </Text>

      <View style={styles.timerDisplay}>
        <Text style={styles.timerMono}>
          {minutes}:{seconds}
        </Text>
      </View>

      <View style={styles.controlRow}>
        <Pressable
          onPress={running ? handlePause : handleStart}
          style={[styles.controlButton, { backgroundColor: "#a4d4ff" }]}
        >
          <Ionicons name={running ? "pause" : "play"} size={24} color="#000" />
        </Pressable>
        <Pressable onPress={handleReset} style={styles.controlButton}>
          <Ionicons name="refresh" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Session-Zeit (min):</Text>
        <TextInput
          keyboardType="number-pad"
          value={customTime}
          onChangeText={(val) => {
            setCustomTime(val);
            setActivePreset(val);
            setMinutes(val.padStart(2, "0"));
            setSeconds("00");
          }}
          style={styles.input}
        />
        <Text style={styles.label}>Kurze Pause (min):</Text>
        <TextInput
          keyboardType="number-pad"
          value={shortBreak}
          onChangeText={setShortBreak}
          style={styles.input}
        />
        <Text style={styles.label}>Lange Pause (min):</Text>
        <TextInput
          keyboardType="number-pad"
          value={longBreak}
          onChangeText={setLongBreak}
          style={styles.input}
        />
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <Pressable
            onPress={() => startBreak(parseInt(shortBreak))}
            style={styles.jumpButton}
          >
            <Text style={styles.label}>→ Kurze Pause</Text>
          </Pressable>
          <Pressable
            onPress={() => startBreak(parseInt(longBreak))}
            style={styles.jumpButton}
          >
            <Text style={styles.label}>→ Lange Pause</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PomodoroTimer;

// ⬇️ Styles unverändert
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "space-evenly",
  },
  sessionText: {
    fontSize: RFPercentage(2.2),
    textAlign: "center",
    fontWeight: "600",
  },
  timerDisplay: {
    alignItems: "center",
  },
  timerMono: {
    fontSize: RFPercentage(7),
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: "bold",
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  controlButton: {
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 20,
  },
  inputSection: {
    alignItems: "center",
  },
  label: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 10,
    width: 100,
    textAlign: "center",
    fontSize: RFPercentage(2.2),
    marginTop: 5,
  },
  jumpButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
});
