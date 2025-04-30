import { useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as Icon from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
  Linking,
} from "react-native";
import { firebaseAuth } from "../firebaseConfig";
import { RFPercentage } from "react-native-responsive-fontsize";
import LicenseModal from "../modals/LicenseModal";


const SettingsScreen = function ({ navigation }) {
  const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.OS === "ios" ? (
          <Pressable
            onPress={({}) => navigation.goBack()}
            style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
            hitSlop={12}
          >
            <Icon.Ionicons name="close-circle" size={36} color="grey" />
          </Pressable>
        ) : null,
    });
  }, [navigation]);

  const openFeedbackMail = () => {
    Linking.openURL('mailto:feedback.nexus.app@gmail.com?subject=Feedback-Mail');
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  borderBottomWidth: 0.5,
                  borderColor: "white",
                  backgroundColor: "#525252",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => setIsLicenseModalVisible(true)}
            >
              <Icon.MaterialIcons
                name="account-circle"
                size={24}
                color={"white"}
                style={[styles.buttonIcon, { backgroundColor: "#8a8a8a" }]}
              />
              <Text style={styles.buttonText}>Accountverwaltung</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  backgroundColor: "#525252",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => {
                setIsLicenseModalVisible(true);
              }}
            >
              <Icon.MaterialIcons
                name="delete-forever"
                size={24}
                color={"white"}
                style={[styles.buttonIcon, { backgroundColor: "#d9534f" }]}
              />
              <Text style={styles.buttonText}>Account löschen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>allgemeine Einstellungen</Text>
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  borderBottomWidth: 0.5,
                  borderColor: "white",
                  backgroundColor: "#525252",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => setIsLicenseModalVisible(true)}
            >
              <Icon.MaterialIcons
                name="nightlight"
                size={24}
                color={"white"}
                style={[styles.buttonIcon, { backgroundColor: "#47b334" }]}
              />
              <Text style={styles.buttonText}>App-Darstellung</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  backgroundColor: "#525252",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => {
                setIsLicenseModalVisible(true);
              }}
            >
              <Icon.MaterialIcons
                name="notifications"
                size={24}
                color={"white"}
                style={[styles.buttonIcon, { backgroundColor: "#cf4f36" }]}
              />
              <Text style={styles.buttonText}>Mitteilungsverwaltung</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt</Text>
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  borderColor: "white",
                  backgroundColor: "#525252",
                  borderRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => openFeedbackMail()}
            >
              <Icon.MaterialIcons
                name="feedback"
                size={24}
                color={"white"}
                style={[styles.buttonIcon, { backgroundColor: "#6366F1" }]}
              />
              <Text style={styles.buttonText}>Feedback geben</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rechtliches</Text>
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  borderColor: "white",
                  backgroundColor: "#525252",
                  borderRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => setIsLicenseModalVisible(true)}
            >
              <Icon.MaterialIcons
                name="info-outline"
                size={24}
                color={"white"}
                style={[styles.buttonIcon, { backgroundColor: "#8a8a8a" }]}
              />
              <Text style={styles.buttonText}>Lizenzen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.pressable, styles.logoutButton]}
          activeOpacity={0.6}
          onPress={() => {
            try {
              firebaseAuth.signOut();
            } catch (e) {
              console.error(`Error:${e}`);
            } finally {
              navigation.goBack();
              navigation.navigate("SplashScreen");
              console.log("Erfolgreich ausgeloggt!");
            }
          }}
        >
          <Icon.MaterialIcons
            name="logout"
            size={20}
            color={"white"}
            style={{ marginLeft: 15 }}
          />
          <Text style={[styles.buttonText, { padding: 11 }]}>Ausloggen</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.copyrightText}>© 2025 - Nexus</Text>
          <Image
            source={require("../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
      <LicenseModal
        visible={isLicenseModalVisible}
        onClose={() => setIsLicenseModalVisible(false)}
      />
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: -10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  section: {
    width: "100%",
    marginTop: 30,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: RFPercentage(2.44),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  buttonsBox: {
    width: "100%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 10,
    color: "white",
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
    padding: 15,
  },
  buttonIcon: {
    marginLeft: 15,
    padding: 5,
    backgroundColor: "black",
    borderRadius: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  copyrightText: {
    color: "#333",
    fontSize: RFPercentage(1.92),
    fontWeight: "500",
  },
  logo: {
    marginLeft: 8,
    width: 30,
    height: 30,
  },
  logoutButton: {
    marginTop: 35,
    alignSelf: "center",
    paddingVertical: 6,
    width: "70%",
    borderRadius: 12,
    backgroundColor: "#d9534f",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
