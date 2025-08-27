import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ProgressBar = memo(({ 
  currentPage, 
  isNameValid, 
  canProceedFromRegionSelection, 
  hasSkippedLastSlide, 
  theme 
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getProgressValue = () => {
      let progress = currentPage;
      
      if (currentPage === 0 && isNameValid) progress += 0.5;
      if (currentPage === 1 && canProceedFromRegionSelection) progress += 0.5;
      if (currentPage === 2 && hasSkippedLastSlide) progress += 0.5;
      
      return progress;
    };

    Animated.timing(progressAnimation, {
      toValue: getProgressValue(),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentPage, isNameValid, canProceedFromRegionSelection, hasSkippedLastSlide, progressAnimation]);

  const animatedWidth = progressAnimation.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
    outputRange: ['5%', '20%', '35%', '50%', '70%', '85%', '100%'],
    extrapolate: 'clamp',
  });

  const getProgressText = () => {
    if (currentPage === 0) return isNameValid ? 'Schritt 1 abgeschlossen' : 'Schritt 1 von 3';
    if (currentPage === 1) return canProceedFromRegionSelection ? 'Schritt 2 abgeschlossen' : 'Schritt 2 von 3 (Pflicht)';
    if (currentPage === 2) return hasSkippedLastSlide ? 'Bereit zum Abschluss!' : 'Schritt 3 von 3 (Optional)';
    return 'Schritt 1 von 3';
  };

  return (
    <View style={[styles.progressContainer, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.border }]}>
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { 
              width: animatedWidth,
              backgroundColor: theme.colors.primary
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: theme.colors.text, fontFamily: theme.fonts?.semibold || 'System' }]}>
        {getProgressText()}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 20,
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    fontSize: 14,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

export default ProgressBar;