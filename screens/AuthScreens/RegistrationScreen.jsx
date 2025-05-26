import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", repeatPassword: "" };

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
    } else if (password.length < 6) {
      newErrors.password =
        "Passwort erfüllt nicht den Sicherheitsanforderungen";
      valid = false;
    }

    if (repeatPassword !== password) {
      newErrors.repeatPassword = "Passwörter stimmen nicht überein";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegistration = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      navigation.navigate("Tabs");
    } catch (error) {
      Alert.alert(
        "Fehler",
        "Registrierung fehlgeschlagen. E-Mail evtl. bereits vergeben."
      );
    } finally {
      setLoading(false);
    }
  };

  const CheckIcon = ({ active }) => (
    <Icon.Feather
      name={active ? "check-circle" : "circle"}
      size={18}
      color={active ? "#4CAF50" : "#999"}
      style={{ marginRight: 6 }}
    />
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.backButtonPlaceholder} />

      <View style={styles.header}>
        <Text style={styles.title}>Registrieren</Text>
        <Text style={styles.subtitle}>Erstelle ein neues Konto</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="deine@email.de"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.passwordLabelRow}>
          <Text style={styles.label}>Passwort</Text>
          <Pressable onPress={() => setShowPasswordHelp(!showPasswordHelp)}>
            <Icon.Feather
              name="help-circle"
              size={18}
              color="#888"
              style={{ marginLeft: 4, marginBottom: 8 }}
              hitSlop={10}
            />
          </Pressable>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="••••••••"
            placeholderTextColor="#888"
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
              color="#888"
            />
          </Pressable>
        </View>
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Passwort wiederholen</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, errors.repeatPassword && styles.inputError]}
            placeholder="••••••••"
            placeholderTextColor="#888"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
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
              color="#888"
            />
          </Pressable>
        </View>
        {errors.repeatPassword ? (
          <Text style={styles.errorText}>{errors.repeatPassword}</Text>
        ) : null}
      </View>

      {showPasswordHelp && (
        <View style={styles.requirementsContainer}>
          <View style={styles.requirementItem}>
            <CheckIcon active={isLengthValid} />
            <Text style={styles.requirementText}>Mindestens 8 Zeichen</Text>
          </View>
          <View style={styles.requirementItem}>
            <CheckIcon active={hasNumber} />
            <Text style={styles.requirementText}>Mindestens 1 Zahl</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleRegistration}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrieren</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>oder</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Icon.FontAwesome name="google" size={20} color="#DB4437" />
        <Text style={styles.googleButtonText}>Mit Google registrieren</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Schon ein Konto?</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          }}
        >
          <Text style={styles.footerLink}>Anmelden</Text>
        </TouchableOpacity>
      </View>
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
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "#888",
    fontSize: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 24,
  },
  googleButtonText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  requirementsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requirementText: {
    color: "#666",
    fontSize: 13,
  },
});

export default RegistrationScreen;
