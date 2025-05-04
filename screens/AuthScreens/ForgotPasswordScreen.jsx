import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "error"

  const auth = firebaseAuth;

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image source={require("../../assets/icon.png")} style={styles.icon} />
      <View style={styles.box}>
        <Text style={styles.title}>Passwort zurücksetzen</Text>
        <Text style={styles.description}>
          Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen
          deines Passworts.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="E-Mail-Adresse"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setStatus(null); // Reset status beim Tippen
          }}
        />
        {status === "success" && (
          <Text style={[styles.status, { color: "green" }]}>
            E-Mail gesendet
          </Text>
        )}
        {status === "error" && (
          <Text style={[styles.status, { color: "red" }]}>
            Fehler beim Senden
          </Text>
        )}
        <TouchableOpacity style={styles.button} onPress={forgotPassword}>
          <Text style={styles.buttonText}>Zurücksetzen</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 30,
  },
  box: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 6,
  },
  status: {
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
