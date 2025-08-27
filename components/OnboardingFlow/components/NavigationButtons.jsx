import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const NavigationButton = memo(({ 
  onPress, 
  text, 
  style, 
  textColor, 
  disabled, 
  theme 
}) => (
  <TouchableOpacity
    style={[
      styles.modernNavButton,
      style,
      { opacity: disabled ? 0.5 : 1 }
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
  >
    <Text style={[
      styles.navButtonText, 
      { 
        color: textColor, 
        fontFamily: theme.fonts?.semibold || 'System'
      }
    ]}>
      {text}
    </Text>
  </TouchableOpacity>
));

const NavigationButtons = memo(({ 
  currentPage, 
  canProceedFromRegionSelection, 
  hasSkippedLastSlide, 
  onPrevPage, 
  onNextPage, 
  onComplete, 
  isNavigating, 
  theme 
}) => {
  const getNextButtonDisabled = () => {
    return (currentPage === 1 && !canProceedFromRegionSelection) || isNavigating;
  };

  const getNextButtonColor = () => {
    return (currentPage === 1 && !canProceedFromRegionSelection)
      ? theme.colors.border
      : theme.colors.primary;
  };

  const getCompleteButtonText = () => {
    return hasSkippedLastSlide ? 'App starten ✓' : 'Fertig ✓';
  };

  return (
    <View style={[styles.navigationContainer, { backgroundColor: theme.colors.background }]}>
      {currentPage > 0 && (
        <NavigationButton
          onPress={onPrevPage}
          text="← Zurück"
          style={[
            styles.backButton, 
            { 
              backgroundColor: theme.colors.card, 
              borderColor: theme.colors.border,
              borderWidth: 1
            }
          ]}
          textColor={theme.colors.text}
          disabled={isNavigating}
          theme={theme}
        />
      )}
      
      <View style={styles.navButtonSpacer} />
      
      {currentPage < 2 && (
        <NavigationButton
          onPress={onNextPage}
          text={currentPage === 0 ? 'Weiter →' : 'Weiter →'}
          style={[
            styles.nextButton,
            { backgroundColor: getNextButtonColor() }
          ]}
          textColor="#FFFFFF"
          disabled={getNextButtonDisabled()}
          theme={theme}
        />
      )}
      
      {currentPage === 2 && (
        <NavigationButton
          onPress={onComplete}
          text={getCompleteButtonText()}
          style={[
            styles.nextButton, 
            { backgroundColor: theme.colors.primary }
          ]}
          textColor="#FFFFFF"
          disabled={isNavigating}
          theme={theme}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  modernNavButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  backButton: {
    marginRight: 'auto',
  },
  nextButton: {
    marginLeft: 'auto',
  },
  navButtonSpacer: {
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default NavigationButtons;