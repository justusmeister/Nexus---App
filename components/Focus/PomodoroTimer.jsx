import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  AppState,
  Platform,
  ActivityIndicator,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useTheme } from "@react-navigation/native";

const STORAGE_KEY = "pomodoro_active_session";
const { width } = Dimensions.get("window");

const PomodoroTimer = () => {
  const theme = useTheme();

  // Timer state
  const [duration, setDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Animation state
  const [showSettings, setShowSettings] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const soundRef = useRef(null);

  const totalTime = useMemo(() => {
    return isBreak
      ? breakCount % 3 === 0
        ? longBreak * 60
        : shortBreak * 60
      : duration * 60;
  }, [isBreak, breakCount, longBreak, shortBreak, duration]);

  const progress = useMemo(() => {
    return totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  }, [timeLeft, totalTime]);

  const formattedTime = useMemo(() => {
    const min = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const sec = (timeLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }, [timeLeft]);

  useEffect(() => {
    restoreSession().finally(() => setIsLoading(false));
    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      sub.remove();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const startTime = Date.now();
    const targetEndTime = startTime + timeLeft * 1000;

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        handleEnd();
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    const saveSession = async () => {
      try {
        if (isRunning) {
          const endTime = Date.now() + timeLeft * 1000;
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              endTime,
              isBreak,
              duration,
              shortBreak,
              longBreak,
              sessionCount,
              breakCount,
              isRunning: true,
            })
          );
        } else {
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              timeLeft,
              isBreak,
              duration,
              shortBreak,
              longBreak,
              sessionCount,
              breakCount,
              isRunning: false,
            })
          );
        }
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    };
    saveSession();
  }, [isRunning, timeLeft, isBreak, duration, shortBreak, longBreak, sessionCount, breakCount]);

  const playSound = useCallback(async () => {
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/finished.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error("Sound playback failed:", error);
    }
  }, []);

  const handleEnd = useCallback(() => {
    playSound();
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    if (!isBreak) {
      setSessionCount((s) => s + 1);
      const newBreakCount = breakCount + 1;
      setBreakCount(newBreakCount);
      startBreak(newBreakCount % 3 === 0 ? longBreak : shortBreak);
    } else {
      setIsBreak(false);
      setTimeLeft(duration * 60);
      setIsRunning(false);
    }
  }, [playSound, fadeAnim, isBreak, breakCount, longBreak, shortBreak, duration]);

  const restoreSession = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return;
      const session = JSON.parse(data);
      setIsBreak(session.isBreak);
      setDuration(session.duration);
      setShortBreak(session.shortBreak);
      setLongBreak(session.longBreak);
      setSessionCount(session.sessionCount || 0);
      setBreakCount(session.breakCount || 0);
      if (session.isRunning && session.endTime) {
        const remaining = Math.floor((session.endTime - Date.now()) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsRunning(true);
        } else setTimeLeft(0);
      } else setTimeLeft(session.timeLeft || session.duration * 60);
    } catch (error) {
      console.error("Failed to restore session:", error);
    }
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") await restoreSession();
      appState.current = nextAppState;
    },
    [restoreSession]
  );

  const animateButton = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = useCallback(() => {
    if (isRunning) return;
    Keyboard.dismiss();
    setIsRunning(true);
    setShowSettings(false);
    animateButton();
  }, [isRunning]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    animateButton();
  }, []);

  const handleReset = useCallback(async () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(duration * 60);
    animateButton();
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, [duration]);

  const startBreak = useCallback((mins) => {
    setIsBreak(true);
    setTimeLeft(mins * 60);
    setIsRunning(true);
  }, []);

  const handleBack = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(duration * 60);
      setIsRunning(false);
    } else handleReset();
    animateButton();
  }, [isBreak, duration, handleReset]);

  const handleNext = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(duration * 60);
      setIsRunning(false);
    } else handleEnd();
    animateButton();
  }, [isBreak, duration, handleEnd]);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
    animateButton();
  }, [showSettings]);

  // Input handlers
  const handleDurationChange = useCallback((value) => {
    const num = Math.max(0, Math.min(99, parseInt(value) || 0));
    setDuration(num);
    if (!isRunning && !isBreak) setTimeLeft(num * 60);
  }, [isRunning, isBreak]);

  const handleShortBreakChange = useCallback((value) => setShortBreak(Math.max(0, Math.min(30, parseInt(value) || 0))), []);
  const handleLongBreakChange = useCallback((value) => setLongBreak(Math.max(0, Math.min(60, parseInt(value) || 0))), []);

  const validateDuration = useCallback(() => { if (duration === 0) { setDuration(1); setTimeLeft(60); } }, [duration]);
  const validateShortBreak = useCallback(() => { if (shortBreak === 0) setShortBreak(1); }, [shortBreak]);
  const validateLongBreak = useCallback(() => { if (longBreak === 0) setLongBreak(1); }, [longBreak]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 12, fontSize: RFPercentage(2) }}>Timer wird geladen...</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={[styles.container, { backgroundColor: theme.colors.background }]} accessible={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {!isRunning && <View style={styles.header}>
          <Text style={[styles.sessionBadge, { backgroundColor: theme.colors.card, color: theme.colors.text }]}>
            {isBreak ? "☕ Pause" : "🍅 Focus"}
          </Text>
          <Pressable onPress={toggleSettings} style={styles.settingsButton}>
            <Feather name={showSettings ? "x" : "settings"} size={24} color={theme.colors.primary} />
          </Pressable>
        </View>}

        {showSettings && !isRunning && (
          <Animated.View style={[styles.settingsPanel, { backgroundColor: theme.colors.card }]}>
            {/** Focus */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Focus-Zeit</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.settingInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]}
                  keyboardType="number-pad"
                  value={duration === 0 ? "" : duration.toString()}
                  maxLength={2}
                  placeholder="25"
                  placeholderTextColor={theme.colors.border}
                  onChangeText={handleDurationChange}
                  onBlur={validateDuration}
                  selectTextOnFocus
                />
                <Text style={[styles.unitText, { color: theme.colors.text }]}>min</Text>
              </View>
            </View>

            {/** Short Break */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Kurze Pause</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.settingInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]}
                  keyboardType="number-pad"
                  value={shortBreak === 0 ? "" : shortBreak.toString()}
                  maxLength={2}
                  placeholder="5"
                  placeholderTextColor={theme.colors.border}
                  onChangeText={handleShortBreakChange}
                  onBlur={validateShortBreak}
                  selectTextOnFocus
                />
                <Text style={[styles.unitText, { color: theme.colors.text }]}>min</Text>
              </View>
            </View>

            {/** Long Break */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Lange Pause</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.settingInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }]}
                  keyboardType="number-pad"
                  value={longBreak === 0 ? "" : longBreak.toString()}
                  maxLength={2}
                  placeholder="15"
                  placeholderTextColor={theme.colors.border}
                  onChangeText={handleLongBreakChange}
                  onBlur={validateLongBreak}
                  selectTextOnFocus
                />
                <Text style={[styles.unitText, { color: theme.colors.text }]}>min</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/** Timer */}
        <View style={styles.timerSection}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressRing, { backgroundColor: theme.colors.lessonDefault }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.colors.primary,
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.timerText, { color: theme.colors.text }]}>{formattedTime}</Text>
          </View>
        </View>

        {/** Controls */}
        <View style={styles.controlSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.controlRow}>
              <Pressable onPress={handleBack} style={[styles.secondaryButton, { backgroundColor: theme.colors.card }]}>
                <Feather name="skip-back" size={20} color={theme.colors.text} />
              </Pressable>

              <Pressable
                onPress={isRunning ? handlePause : handleStart}
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.colors.primary },
                  isRunning && { backgroundColor: theme.colors.background, borderWidth: 2, borderColor: theme.colors.warning },
                ]}
              >
                <Feather name={isRunning ? "pause" : "play"} size={28} color={isRunning ? theme.colors.warning : theme.colors.card} />
              </Pressable>

              <Pressable onPress={handleNext} style={[styles.secondaryButton, { backgroundColor: theme.colors.card }]}>
                <Feather name="skip-forward" size={20} color={theme.colors.text} />
              </Pressable>
            </View>
          </Animated.View>

          <View style={styles.bottomControls}>
            <Pressable onPress={handleReset} style={styles.resetButton}>
              <Feather name="refresh-ccw" size={18} color={theme.colors.border} />
              <Text style={[styles.resetText, { color: theme.colors.text }]}>Reset</Text>
            </Pressable>
          </View>
        </View>

        {/** Stats */}
        {!isRunning && (
          <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{sessionCount}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>Sessions</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {Math.round((sessionCount * duration) / 60 * 10) / 10}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>Stunden</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  sessionBadge: { fontSize: RFPercentage(2.5), fontWeight: "600", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  settingsButton: { padding: 8 },
  settingsPanel: { borderRadius: 16, padding: 20, marginBottom: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  settingLabel: { fontSize: RFPercentage(2.2), fontWeight: "500" },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  settingInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, width: 60, textAlign: "center", fontSize: RFPercentage(2), fontWeight: "500" },
  unitText: { marginLeft: 8, fontSize: RFPercentage(1.8) },
  timerSection: { flex: 1, justifyContent: "center",  alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressRing: {
    width: width * 0.7,
    height: 8,
    backgroundColor: '#E8E6FF',
    borderRadius: 4,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 4,
  },
  timerText: {
    fontVariant: [ "tabular-nums" ],
    fontSize: RFPercentage(8),
    fontWeight: '300',
    color: '#333',
    letterSpacing: 2,
  },
  progressText: {
    fontSize: RFPercentage(2),
    color: '#666',
    fontWeight: '500',
  },
  controlSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#6C63FF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pauseButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetText: {
    marginLeft: 6,
    fontSize: RFPercentage(1.8),
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: RFPercentage(1.8),
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: RFPercentage(1.8),
    color: '#666',
    fontWeight: '500',
  },
});

export default React.memo(PomodoroTimer);