// components/NameSlide.js
import React, { useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height: screenHeight } = Dimensions.get('window');

const NameSlide = memo(({ 
  name, 
  isNameValid, 
  onNameChange, 
  onSkip, 
  onNext, 
  isNavigating, 
  theme 
}) => {
  const nameInputRef = useRef(null);

  const handleSubmitEditing = () => {
    if(!isNameValid)
      onNameChange("Gast");
      onNext();
  };

  return (
    <View style={styles.slideContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.slideContent}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.slideTitle, { color: theme.colors.text, fontFamily: theme.fonts?.bold || 'System' }]}>
          Wie heißt du?
        </Text>
        <Text style={[styles.slideSubtitle, { color: theme.colors.text, fontFamily: theme.fonts?.regular || 'System' }]}>
          Wir möchten dich gerne persönlich begrüßen
        </Text>
        <Text style={[styles.optionalText, { color: theme.colors.text + '60', fontFamily: theme.fonts?.regular || 'System' }]}>
          (Optional)
        </Text>
        
        {/* Modern Input Field Container */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={nameInputRef}
            style={[
              styles.modernTextInput,
              {
                borderColor: isNameValid ? theme.colors.primary : theme.colors.border,
                color: theme.colors.text,
                fontFamily: theme.fonts?.regular || 'System',
                borderRadius: theme.radius?.md || 12
              }
            ]}
            placeholder="Nutzer 123"
            placeholderTextColor={theme.colors.text + '99'}
            value={name}
            onChangeText={onNameChange}
            returnKeyType="next"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={50}
            onSubmitEditing={handleSubmitEditing}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.modernSkipButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={onSkip}
          activeOpacity={0.7}
          disabled={isNavigating}
        >
          <Text style={[styles.skipButtonText, { color: theme.colors.text, fontFamily: theme.fonts?.regular || 'System' }]}>
            Überspringen
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
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
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  modernTextInput: {
    borderWidth: 1.5,
    padding: 14,
    fontSize: 16,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
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

export default NameSlide;