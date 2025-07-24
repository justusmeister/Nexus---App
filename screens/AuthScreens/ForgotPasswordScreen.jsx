import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
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
    <View style={styles.container}>
    <ScrollView behavior="padding" showsVerticalScrollIndicator={false}>
      
    <View style={styles.topSection}>
  <Pressable
    onPress={() => navigation.goBack()}
    style={({ pressed }) => [
      styles.backButton,
      { opacity: pressed ? 0.6 : 1 },
    ]}
    hitSlop={12}
  >
    <Icon.Feather name="arrow-left" size={22} color="black" />
  </Pressable>

  <View style={styles.header}>
    <Text style={styles.title}>Passwort zurücksetzen</Text>
    <Text style={styles.subtitle}>Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.</Text>
  </View>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
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
  topSection: {
    marginTop: 60,
    marginBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
padding: 6,
borderRadius: 15,
backgroundColor: "rgba(0, 122, 255, 0.08)",  
borderWidth: 1,
borderColor: "#c6c6c6",                    
justifyContent: "center",
alignItems: "center",
shadowColor: "darkgray",                   
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.25,
shadowRadius: 4.65,
elevation: 8,
  },
  header: {
    marginTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
  },
});

export default ForgotPasswordScreen;