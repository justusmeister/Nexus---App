import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, "success", "error"
  const [error, setError] = useState("");

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Platzhalter für silbernen Back-Button */}
      <View style={styles.backButtonPlaceholder} />

      <View style={styles.header}>
        <Text style={styles.title}>Passwort zurücksetzen</Text>
        <Text style={styles.subtitle}>
          Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen
          deines Passworts.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="deine@email.de"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setStatus(null);
            setError("");
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {status === "success" && (
        <Text style={styles.successText}>
          Email wurde erfolgreich gesendet!
        </Text>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Link senden</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Zurück zum Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  backButtonPlaceholder: {
    height: 40,
    marginTop: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  successText: {
    color: "#34C759",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;