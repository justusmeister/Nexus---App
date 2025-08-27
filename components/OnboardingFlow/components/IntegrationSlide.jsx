// components/IntegrationSlide.js
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height: screenHeight } = Dimensions.get('window');

const IntegrationButton = memo(({ 
  onPress, 
  backgroundColor, 
  text, 
  isNavigating 
}) => (
  <TouchableOpacity
    style={[styles.modernIntegrationButton, { backgroundColor }]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={isNavigating}
  >
    <Text style={styles.integrationButtonText}>
      {text}
    </Text>
  </TouchableOpacity>
));

const IntegrationSlide = memo(({ onSkip, isNavigating, theme }) => {
  const handleEmailIntegration = () => {
    console.log('Email verknüpfen');
    Alert.alert('Feature kommt bald', 'Email-Integration wird in einem zukünftigen Update verfügbar sein.');
  };

  const handleUntisIntegration = () => {
    console.log('Untis konfigurieren');
    Alert.alert('Feature kommt bald', 'Untis-Integration wird in einem zukünftigen Update verfügbar sein.');
  };

  return (
    <KeyboardAwareScrollView
      style={styles.slideContainer}
      contentContainerStyle={styles.slideContent}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.slideTitle, { color: theme.colors.text, fontFamily: theme.fonts?.bold || 'System' }]}>
        Fast geschafft!
      </Text>
      <Text style={[styles.slideSubtitle, { color: theme.colors.text, fontFamily: theme.fonts?.regular || 'System' }]}>
        Verknüpfe deine Schul-Accounts für den besten Start
      </Text>
      <Text style={[styles.optionalText, { color: theme.colors.text + '60', fontFamily: theme.fonts?.regular || 'System' }]}>
        (Optional)
      </Text>
      
      <View style={styles.integrationButtons}>
        <IntegrationButton
          onPress={handleEmailIntegration}
          backgroundColor={theme.colors.primary}
          text="📧 Email verknüpfen"
          isNavigating={isNavigating}
        />
        
        <IntegrationButton
          onPress={handleUntisIntegration}
          backgroundColor={theme.colors.success || '#28a745'}
          text="🏫 Untis konfigurieren"
          isNavigating={isNavigating}
        />
      </View>
      
      <TouchableOpacity
        style={[styles.modernSkipButton, { 
          backgroundColor: theme.colors.card, 
          borderColor: theme.colors.border,
          marginTop: 24
        }]}
        onPress={onSkip}
        activeOpacity={0.7}
        disabled={isNavigating}
      >
        <Text style={[styles.skipButtonText, { color: theme.colors.text, fontFamily: theme.fonts?.regular || 'System' }]}>
          Überspringen
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: screenHeight * 0.6,
  },
  slideTitle: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  slideSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.8,
    lineHeight: 22,
  },
  optionalText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  integrationButtons: {
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  modernIntegrationButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  integrationButtonText: {
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    fontFamily: 'System',
    fontWeight: '600',
  },
  modernSkipButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skipButtonText: {
    fontSize: 15,
    opacity: 0.9,
  },
});

export default IntegrationSlide;