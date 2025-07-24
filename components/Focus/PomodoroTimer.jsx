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
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';

const STORAGE_KEY = "pomodoro_active_session";
const { width } = Dimensions.get('window');

const PomodoroTimer = () => {
  // Core timer state
  const [duration, setDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation and UI state
  const [showSettings, setShowSettings] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Refs
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const soundRef = useRef(null);

  // Memoized values for performance
  const totalTime = useMemo(() => {
    return isBreak 
      ? (breakCount % 3 === 0 ? longBreak : shortBreak) * 60
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

  // Initialize and cleanup
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

  // Timer effect with background handling
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Use timestamp-based calculation for accuracy
    const startTime = Date.now();
    const targetEndTime = startTime + timeLeft * 1000;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        handleEnd();
      }
    }, 100); // More frequent updates for smoother progress

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]); // Add timeLeft dependency for restart

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  // Session persistence - only save when running
  useEffect(() => {
    const saveSession = async () => {
      try {
        if (isRunning) {
          // Save running session with end time
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
              isRunning: true
            })
          );
        } else {
          // Save paused session with current time left
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
              isRunning: false
            })
          );
        }
      } catch (error) {
        console.error('Failed to save session:', error);
      }
    };

    saveSession();
  }, [isRunning, timeLeft, isBreak, duration, shortBreak, longBreak, sessionCount, breakCount]);

  // Sound management
  const playSound = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/finished.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }, []);

  // Move handleEnd before restoreSession to fix dependency
  const handleEnd = useCallback(() => {
    playSound();
    
    // Fade animation for session transition
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    if (!isBreak) {
      setSessionCount((s) => s + 1);
      const newBreakCount = breakCount + 1;
      setBreakCount(newBreakCount);
      
      if (newBreakCount % 3 === 0) {
        startBreak(longBreak);
      } else {
        startBreak(shortBreak);
      }
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
      
      // Restore basic session data
      setIsBreak(session.isBreak);
      setDuration(session.duration);
      setShortBreak(session.shortBreak);
      setLongBreak(session.longBreak);
      setSessionCount(session.sessionCount || 0);
      setBreakCount(session.breakCount || 0);
      
      if (session.isRunning && session.endTime) {
        // Session was running - calculate remaining time
        const remaining = Math.floor((session.endTime - Date.now()) / 1000);
        
        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsRunning(true);
        } else {
          // Timer expired while away
          setTimeLeft(0);
          setIsRunning(false);
          // Don't auto-trigger handleEnd here to avoid issues
        }
      } else {
        // Session was paused - restore exact time left
        setTimeLeft(session.timeLeft || session.duration * 60);
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
  }, []);

  const handleAppStateChange = useCallback(async (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      await restoreSession();
    }
    appState.current = nextAppState;
  }, [restoreSession]);

  const animateButton = useCallback(() => {
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
  }, [scaleAnim]);

  const handleStart = useCallback(() => {
    if (isRunning) return;
    Keyboard.dismiss();
    setIsRunning(true);
    setShowSettings(false);
    animateButton();
  }, [isRunning, animateButton]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    animateButton();
  }, [animateButton]);

  const handleReset = useCallback(async () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(duration * 60);
    animateButton();
    
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }, [duration, animateButton]);

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
    } else {
      handleReset();
    }
    animateButton();
  }, [isBreak, duration, handleReset, animateButton]);

  const handleNext = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(duration * 60);
      setIsRunning(false);
    } else {
      handleEnd();
    }
    animateButton();
  }, [isBreak, duration, handleEnd, animateButton]);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
    animateButton();
  }, [showSettings, animateButton]);

  // Optimized input handlers with better UX
  const handleDurationChange = useCallback((value) => {
    // Allow empty input during editing
    if (value === '') {
      setDuration(0);
      if (!isRunning && !isBreak) {
        setTimeLeft(0);
      }
      return;
    }
    
    const num = Math.max(0, Math.min(99, parseInt(value) || 0));
    setDuration(num);
    if (!isRunning && !isBreak) {
      setTimeLeft(num * 60);
    }
  }, [isRunning, isBreak]);

  const handleShortBreakChange = useCallback((value) => {
    if (value === '') {
      setShortBreak(0);
      return;
    }
    const num = Math.max(0, Math.min(30, parseInt(value) || 0));
    setShortBreak(num);
  }, []);

  const handleLongBreakChange = useCallback((value) => {
    if (value === '') {
      setLongBreak(0);
      return;
    }
    const num = Math.max(0, Math.min(60, parseInt(value) || 0));
    setLongBreak(num);
  }, []);

  // Validate inputs on blur to ensure minimum values
  const validateDuration = useCallback(() => {
    if (duration === 0) {
      setDuration(1);
      setTimeLeft(60);
    }
  }, [duration]);

  const validateShortBreak = useCallback(() => {
    if (shortBreak === 0) {
      setShortBreak(1);
    }
  }, [shortBreak]);

  const validateLongBreak = useCallback(() => {
    if (longBreak === 0) {
      setLongBreak(1);
    }
  }, [longBreak]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Timer wird geladen...</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container} accessible={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header with session info */}
        {!isRunning && <View style={styles.header}>
          <Text style={styles.sessionBadge}>
            {isBreak ? '☕ Pause' : '🍅 Focus'}
          </Text>
          <Pressable onPress={toggleSettings} style={styles.settingsButton}>
            <Ionicons 
              name={showSettings ? "close" : "settings-outline"} 
              size={24} 
              color="#6C63FF" 
            />
          </Pressable>
        </View>}

        {/* Settings Panel */}
        {showSettings && !isRunning && (
          <Animated.View style={styles.settingsPanel}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Focus-Zeit</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.settingInput, duration === 0 && styles.inputEmpty]}
                  keyboardType="number-pad"
                  value={duration === 0 ? '' : duration.toString()}
                  maxLength={2}
                  placeholder="25"
                  placeholderTextColor="#999"
                  onChangeText={handleDurationChange}
                  onBlur={validateDuration}
                  selectTextOnFocus
                />
                <Text style={styles.unitText}>min</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Kurze Pause</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.settingInput, shortBreak === 0 && styles.inputEmpty]}
                  keyboardType="number-pad"
                  value={shortBreak === 0 ? '' : shortBreak.toString()}
                  maxLength={2}
                  placeholder="5"
                  placeholderTextColor="#999"
                  onChangeText={handleShortBreakChange}
                  onBlur={validateShortBreak}
                  selectTextOnFocus
                />
                <Text style={styles.unitText}>min</Text>
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Lange Pause</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.settingInput, longBreak === 0 && styles.inputEmpty]}
                  keyboardType="number-pad"
                  value={longBreak === 0 ? '' : longBreak.toString()}
                  maxLength={2}
                  placeholder="15"
                  placeholderTextColor="#999"
                  onChangeText={handleLongBreakChange}
                  onBlur={validateLongBreak}
                  selectTextOnFocus
                />
                <Text style={styles.unitText}>min</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Main Timer Display */}
        <View style={styles.timerSection}>
          {/* Progress Ring */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRing}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.timerText}>{formattedTime}</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.controlRow}>
              <Pressable onPress={handleBack} style={styles.secondaryButton}>
                <Ionicons name="play-back-outline" size={20} color="#666" />
              </Pressable>
              
              <Pressable 
                onPress={isRunning ? handlePause : handleStart} 
                style={[
                  styles.primaryButton, 
                  isRunning && styles.pauseButton,
                  (duration === 0 && !isBreak) && styles.disabledButton
                ]}
                disabled={duration === 0 && !isBreak}
              >
                <Ionicons 
                  name={isRunning ? "pause" : "play"} 
                  size={28} 
                  color={isRunning ? "#FF6B6B" : ((duration === 0 && !isBreak) ? "#CCC" : "#FFF")} 
                />
              </Pressable>
              
              <Pressable onPress={handleNext} style={styles.secondaryButton}>
                <Ionicons name="play-forward-outline" size={20} color="#666" />
              </Pressable>
            </View>
          </Animated.View>
          
          <View style={styles.bottomControls}>
            <Pressable onPress={handleReset} style={styles.resetButton}>
              <Ionicons name="refresh-outline" size={18} color="#999" />
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            
            {/*isRunning && (
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Läuft...</Text>
              </View>
            )*/}
          </View>
        </View>

        {/* Stats */}
        {!isRunning && <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sessionCount}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round((sessionCount * duration) / 60 * 10) / 10}</Text>
            <Text style={styles.statLabel}>Stunden</Text>
          </View>
        </View>}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: RFPercentage(2),
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sessionBadge: {
    fontSize: RFPercentage(2.5),
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#E8E6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  settingsButton: {
    padding: 8,
  },
  settingsPanel: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: RFPercentage(2.2),
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    textAlign: 'center',
    fontSize: RFPercentage(2),
    backgroundColor: '#FFF',
    fontWeight: '500',
  },
  inputEmpty: {
    borderColor: '#FFC107',
    backgroundColor: '#FFF8E1',
  },
  unitText: {
    marginLeft: 8,
    fontSize: RFPercentage(1.8),
    color: '#666',
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#999',
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
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: RFPercentage(1.8),
    color: '#4CAF50',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
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