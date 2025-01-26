import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "../firebaseConfig";

const LoginScreen = function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = firebaseAuth;

  const signIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        navigation.navigate("Tabs");
        setEmail("");
        setPassword("");
      }
    } catch (nativeErrorCode) {
      console.log(nativeErrorCode);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) navigation.navigate("Tabs");
    } catch (nativeErrorCode) {
      console.log(nativeErrorCode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.imageBox}>
        <Image
          style={styles.logoImage}
          source={require("../assets/icon.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loginWindow}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          placeholderTextColor="#ffffff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.signInButton} onPress={signIn}>
          <Text style={styles.buttonText}>Anmelden</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={signUp}>
          <Text style={styles.buttonText}>Registrieren</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Icon.AntDesign name="google" size={20} color="#ffffff" />
          <Text style={[styles.buttonText, { marginLeft: 8 }]}>
            Mit Google anmelden
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFEEF6",
  },
  loginWindow: {
    width: "100%",
    height: "70%",
    backgroundColor: "#3892d6",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageBox: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: "#ffffff",
    fontSize: 16,
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2678C0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E5A99",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "#DB4437",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
