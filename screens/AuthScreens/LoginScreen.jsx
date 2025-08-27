import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";
import { useRoute, useTheme } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GoogleButton from "./components/GoogleButton";
import TopSection from "./components/TopSection";
import Divider from "./components/Divider";
import Footer from "./components/Footer";
import ActionButton from "./components/ActionButton";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const route = useRoute();
  const { params } = route;
  const { colors, spacing, radius, fonts } = useTheme();

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Bitte E-Mail eingeben";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Bitte Passwort eingeben";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigation.navigate("Tabs");
    } catch (error) {
      Alert.alert("Fehler", "Falsche Anmeldedaten oder Nutzer existiert nicht");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegistration = () => {
    if (params?.window == 1) navigation.goBack();
    else navigation.navigate("RegistrationScreen", { window: 1 });
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background, paddingHorizontal: spacing.lg }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      {/* Top Section */} 
      <TopSection title="Willkommen zurück 👋" subtitle="Melde dich mit deinem Konto an" onBack={() => navigation.goBack()} />

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text, fontFamily: fonts.semibold }]} >E-Mail</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, fontFamily: fonts.regular, borderRadius: radius.md },
            errors.email && { borderColor: colors.warning },
          ]}
          placeholder="deine@email.de"
          placeholderTextColor={colors.text + "99"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? (
          <Text style={[styles.errorText, { color: colors.warning, fontFamily: fonts.regular }]}>{errors.email}</Text>
        ) : null}
      </View>

      {/* Passwort */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text, fontFamily: fonts.semibold }]}>Passwort</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, fontFamily: fonts.regular, borderRadius: radius.md },
              errors.password && { borderColor: colors.warning },
            ]}
            placeholder="••••••••"
            placeholderTextColor={colors.text + "99"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={10}
          >
            <Icon.Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.text + "99"}
            />
          </Pressable>
        </View>
        {errors.password ? (
          <Text style={[styles.errorText, { color: colors.warning, fontFamily: fonts.regular }]}>{errors.password}</Text>
        ) : null}
      </View>

      {/* Passwort vergessen */}
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, alignSelf: "flex-end", marginBottom: spacing.lg }]}
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        hitSlop={10}
      >
        <Text style={{ color: colors.primary, fontFamily: fonts.semibold }}>Passwort vergessen?</Text>
      </Pressable>

      {/* Anmelden Button */}
      <ActionButton
        onPress={handleLogin}
        loading={loading}
        title="Anmelden"
      />

      <Divider />

      {/* Google Button */}
      <GoogleButton text="Mit Google anmelden" />

      {/* Footer */}
      <Footer question1="Noch kein Konto?" screenName="Registrieren" onNavigateToScreen={handleNavigateToRegistration} />

    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    padding: 14,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
  },
});

export default LoginScreen;
