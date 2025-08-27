import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SvgWelcome from "../../assets/illustrations/welcome.svg";
import { useNavigation, useTheme } from "@react-navigation/native";
import GoogleButton from "./components/GoogleButton";
import Divider from "./components/Divider";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { colors, radius, fonts } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontFamily: fonts.bold }]}>
          Lass uns starten
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.text + "99", fontFamily: fonts.bold },
          ]}
        >
          Beginne jetzt mit deiner Schulorganisation
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <SvgWelcome width={width * 0.57} height={width * 0.57} />
      </View>

      <View style={[styles.actionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: colors.primary, borderRadius: radius.lg }]}
          onPress={() =>
            navigation.navigate("RegistrationScreen", { window: 0 })
          }
        >
          <Text style={[styles.registerText, { color: colors.background , fontFamily: fonts.semibold }]}>Kostenlos registrieren</Text>
        </TouchableOpacity>

        <GoogleButton text="Fortfahren mit Google" />

        <View style={{ marginBottom: 14, marginTop: 6 }}>
          <Text style={[styles.termsText, { color: colors.text, fontFamily: fonts.regular }]}>
            Mit der Registrierung akzeptierst du unsere{" "}
            <Text style={{ textDecorationLine: "underline" }}>AGB</Text> und{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Datenschutzbestimmungen
            </Text>
            .
          </Text>
        </View>

        <Divider />

        <View style={styles.loginContainer}>
          <Text style={[styles.loginPrompt, { color: colors.text + "AA", fontFamily: fonts.regular }]}>
            Bereits ein Konto?
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LoginScreen", { window: 0 })
            }
            style={styles.loginButton}
          >
            <Text style={[styles.loginLink, { color: colors.primary, fontFamily: fonts.semibold }]}>
              Anmelden
            </Text>
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
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
  registerButton: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    fontSize: 14,
  },
  loginButton: {
    marginLeft: 8,
  },
  loginLink: {
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
