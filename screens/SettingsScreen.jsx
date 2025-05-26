import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Platform,
  Linking,
  SafeAreaView,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { firebaseAuth } from "../firebaseConfig";
import { getAuth, deleteUser } from "firebase/auth";
import { useActionSheet } from "@expo/react-native-action-sheet";
import LicenseModal from "../modals/LicenseModal";
import SettingItem from "../components/Settings/SettingItem";

const SettingsScreen = ({ navigation }) => {
  const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const auth = getAuth();
  const user = auth.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.OS === "ios" && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
            hitSlop={12}
          >
            <Icon.Ionicons name="close-circle" size={34} color="grey" />
          </Pressable>
        ),
    });
  }, [navigation]);

  const handleLogout = () => {
    const options = ["Abmelden", "Abbrechen"];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        title: "Möchtest du dich wirklich abmelden?",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          try {
            firebaseAuth.signOut();
          } finally {
            navigation.goBack();
            navigation.navigate("SplashScreen");
          }
        }
      }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Konto löschen",
      "Das Konto und alle Daten werden unwiderruflich gelöscht.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: () =>
            deleteUser(user)
              .then(() => {
                navigation.goBack();
                navigation.navigate("AuthStack");
              })
              .catch(() => console.log("Löschen fehlgeschlagen")),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ACCOUNT */}
          <Section title="Account">
            <SettingItem
              icon="account-circle"
              label="Accountverwaltung"
              bg="#6366F1"
              onPress={() => setIsLicenseModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="delete-forever"
              label="Account löschen"
              bg="#EF4444"
              onPress={handleDeleteAccount}
            />
          </Section>

          {/* APP */}
          <Section title="Allgemein">
            <SettingItem
              icon="nightlight"
              label="App-Darstellung"
              bg="#10B981"
              onPress={() => setIsLicenseModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="notifications"
              label="Mitteilungsverwaltung"
              bg="#F59E0B"
              onPress={() => setIsLicenseModalVisible(true)}
            />
          </Section>

          {/* FEEDBACK */}
          <Section title="Kontakt">
            <SettingItem
              icon="feedback"
              label="Feedback geben"
              bg="#3B82F6"
              onPress={() =>
                Linking.openURL(
                  "mailto:feedback.nexus.app@gmail.com?subject=Feedback-Mail"
                )
              }
            />
          </Section>

          {/* LEGAL */}
          <Section title="Rechtliches">
            <SettingItem
              icon="info-outline"
              label="Lizenzen"
              bg="#6B7280"
              onPress={() => setIsLicenseModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="lock-outline"
              label="Datenschutzerklärung"
              bg="#6366F1" // Indigo
              onPress={() => navigation.navigate("PrivacyPolicy")}
              showDivider
            />
            <SettingItem
              icon="gavel"
              label="AGB"
              bg="#F59E0B" // Amber
              onPress={() => navigation.navigate("Terms")}
              showDivider
            />
            <SettingItem
              icon="article"
              label="Impressum"
              bg="#10B981" // Emerald
              onPress={() => navigation.navigate("Imprint")}
            />
          </Section>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logout,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Icon.MaterialIcons name="logout" size={22} color="white" />
            <Text style={styles.logoutText}>Abmelden</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 – Nexus</Text>
            <Image
              source={require("../assets/adaptive-icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <LicenseModal
          visible={isLicenseModalVisible}
          onClose={() => setIsLicenseModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  scrollViewContent: {
    paddingTop: 6,
    paddingBottom: 50,
  },
  container: {
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.065)",
    borderWidth: 1,
    borderColor: "#c6c6c6",
    shadowColor: "darkgray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 22,
    paddingVertical: 4,
  },
  logout: {
    marginTop: 26,
    backgroundColor: "#e35a5a",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 12,
    fontSize: 17,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  logo: {
    marginTop: 8,
    width: 30,
    height: 30,
  },
});
