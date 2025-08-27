import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";
import { useTheme } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopSection from "./components/TopSection";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); //null, "success" oder "error"
  const [error, setError] = useState("");

  const { colors, spacing, radius, fonts } = useTheme();

  const validate = () => {
    if (!email) {
      setError("Bitte E-Mail eingeben");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Ungültige E-Mail-Adresse");
      return false;
    }
    setError("");
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError("Fehler beim Senden der E-Mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={[styles.container, { backgroundColor: colors.background, paddingHorizontal: spacing.lg }]} enableOnAndroid
    keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
      {/* Top Section */} 
      <TopSection title="Passwort zurücksetzen" subtitle="Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen deines Passworts." onBack={() => navigation.goBack()} />

        {/* E-Mail Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text, fontFamily: fonts.semibold }]}>E-Mail</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                borderRadius: radius.md,
                fontFamily: fonts.regular,
              },
              error && { borderColor: colors.warning },
            ]}
            placeholder="deine@email.de"
            placeholderTextColor={colors.text + "99"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setStatus(null);
              setError("");
            }}
          />
          {error ? <Text style={[styles.errorText, { color: colors.warning, fontFamily: fonts.regular }]}>{error}</Text> : null}
        </View>

        {/* Erfolgsmeldung */}
        {status === "success" && (
          <Text style={[styles.successText, { color: colors.success, fontFamily: fonts.regular }]}>
            Email wurde erfolgreich gesendet!
          </Text>
        )}

        {/* Primary Button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: colors.primary, borderRadius: radius.lg },
          ]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.background, fontFamily: fonts.semibold }]}>
              Link senden
            </Text>
          )}
        </TouchableOpacity>

        {/* Secondary Button */}
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { borderColor: colors.border, borderRadius: radius.lg },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary, fontFamily: fonts.semibold }]}>
            Zurück zum Login
          </Text>
        </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderWidth: 1.5, padding: 14, fontSize: 16 },
  errorText: { fontSize: 12, marginTop: 4 },
  successText: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { fontSize: 16 },
  secondaryButton: {
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
  },
  secondaryButtonText: { fontSize: 16 },
});

export default ForgotPasswordScreen;
