import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SvgWelcome from "../../assets/illustrations/welcome.svg";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen</Text>

      <View style={styles.illustrationContainer}>
        <SvgWelcome width={width * 0.7} height={width * 0.7} />
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("RegistrationScreen")}
      >
        <Text style={styles.registerText}>Registrieren</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginPrompt}>Schon einen Account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#007AFF", // dein Haupt-CTA-Farbton
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 20,
  },
  registerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginPrompt: {
    color: "#444",
    fontSize: 14,
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
