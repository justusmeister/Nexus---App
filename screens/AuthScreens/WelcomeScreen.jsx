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
import GoogleButton from "./components/GoogleButton";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header mit dezentem Muster-Hintergrund */}
      <View style={styles.header}>
        <Text style={styles.title}>Lass uns starten</Text>
        <Text style={styles.subtitle}>Beginne jetzt mit deiner Schulorganisation</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <SvgWelcome width={width * 0.57} height={width * 0.57} />
        <View style={styles.illustrationOverlay} />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("RegistrationScreen", { window: 0 })}
        >
          <Text style={styles.registerText}>Kostenlos registrieren</Text>
        </TouchableOpacity>

        <GoogleButton text="Fortfahren mit Google"/>

        <View style={{ marginBottom: 14, marginTop: 6, }}>
          <Text style={styles.termsText}>
            Mit der Registrierung akzeptierst du unsere{" "}
            <Text style={{ textDecorationLine: "underline" }}>AGBs</Text> und{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Datenschutzbestimmungen
            </Text>
            .
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>oder</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginPrompt}>Bereits ein Konto?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen", { window: 0 })}
            style={styles.loginButton}
          >
            <Text style={styles.loginLink}>Anmelden</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  illustrationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionsContainer: {
    padding: 32,
    paddingBottom: 40,
    paddingTop: 35,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  registerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 12,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: 14,
  },
  loginButton: {
    marginLeft: 8,
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
});
