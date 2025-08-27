import React, { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute, useTheme } from "@react-navigation/native";

import EmailInput from "./components/EmailInput";
import PasswordInput from "./components/PasswordInput";
import ConfirmPasswordInput from "./components/ConfirmPasswordInput";
import PasswordRequirements from "./components/PasswordRequirements";
import ActionButton from "./components/ActionButton";
import Divider from "./components/Divider";
import GoogleButton from "./components/GoogleButton";
import Footer from "./components/Footer";
import { validateRegistration } from "./utils/validation";
import TopSection from "./components/TopSection";

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [errors, setErrors] = useState({});

  const route = useRoute();
  const { params } = route;
  const { colors, spacing, radius, fonts } = useTheme();

  // Memoized validation results
  const passwordValidation = useMemo(() => ({
    isLengthValid: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
  }), [formData.password]);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const togglePasswordHelp = useCallback(() => {
    setShowPasswordHelp(prev => !prev);
  }, []);

  const handleRegistration = useCallback(async () => {
    const validationResult = validateRegistration(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      navigation.navigate("Tabs");
    } catch (error) {
      Alert.alert(
        "Fehler",
        "Registrierung fehlgeschlagen. E-Mail evtl. bereits vergeben."
      );
    } finally {
      setLoading(false);
    }
  }, [formData, navigation]);

  const handleNavigateToLogin = useCallback(() => {
    if (params?.window === 1) {
      navigation.goBack();
    } else {
      navigation.navigate("LoginScreen", { window: 1 });
    }
  }, [navigation, params]);

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background, paddingHorizontal: spacing.lg }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      
      {/* Top Section */} 
      <TopSection title="Registrieren 🎉" subtitle="Erstelle ein neues Konto" onBack={() => navigation.goBack()} />

      <EmailInput
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        error={errors.email}
      />

      <PasswordInput
        value={formData.password}
        onChangeText={(value) => updateFormData('password', value)}
        showPassword={showPassword}
        onToggleVisibility={togglePasswordVisibility}
        onToggleHelp={togglePasswordHelp}
        error={errors.password}
      />

      <ConfirmPasswordInput
        value={formData.confirmPassword}
        onChangeText={(value) => updateFormData('confirmPassword', value)}
        showPassword={showPassword}
        onToggleVisibility={togglePasswordVisibility}
        error={errors.confirmPassword}
      />

      {showPasswordHelp && (
        <PasswordRequirements validation={passwordValidation} />
      )}

      <ActionButton
        onPress={handleRegistration}
        loading={loading}
        title="Registrieren"
      />

      <Divider />

      <GoogleButton text="Mit Google registrieren" />

      <Footer question1="Schon ein Konto?" screenName="Anmelden" onNavigateToScreen={handleNavigateToLogin} />
    </KeyboardAwareScrollView>
  );
};

export default RegistrationScreen;