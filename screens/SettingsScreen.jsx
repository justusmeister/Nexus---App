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
import Snackbar from "react-native-snackbar";
import { ReactNativeLegal } from "react-native-legal";
import PortraylModal from "../modals/PortraylModal";
import { useTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

const version = Constants.expoConfig?.version;
//const buildNumber = Constants.expoConfig?.android?.versionCode || Constants.expoConfig?.ios?.buildNumber;


function launchNotice() {
  ReactNativeLegal.launchLicenseListScreen("Lizenzen");
}

const SettingsScreen = ({ navigation }) => {
  const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);
  const [isPortraylModalVisible, setIsPortraylModalVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors, fonts } = useTheme();

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
            <Icon.Feather
              name="x"
              size={30}
              color={colors.text}
            />
          </Pressable>
        ),
    });
  }, [navigation, colors.text]);

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
    <View
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ACCOUNT */}
          <Section title="Account" colors={colors} fonts={fonts}>
            <SettingItem
              icon="user"
              label="Accountverwaltung"
              bg={colors.iconBg.primary}
              onPress={() => setIsLicenseModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="trash-2"
              label="Account löschen"
              bg={colors.iconBg.warning}
              onPress={handleDeleteAccount}
            />
          </Section>

          {/* APP */}
          <Section title="Allgemein" colors={colors} fonts={fonts}>
            <SettingItem
              icon="moon"
              label="App-Darstellung"
              bg={colors.iconBg.success}
              onPress={() => setIsPortraylModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="bell"
              label="Mitteilungsverwaltung"
              bg={colors.iconBg.exam}
              onPress={() => setIsLicenseModalVisible(true)}
            />
          </Section>

          {/* FEEDBACK */}
          <Section title="Kontakt" colors={colors} fonts={fonts}>
            <SettingItem
              icon="message-circle"
              label="Feedback geben"
              bg={colors.iconBg.primary}
              onPress={() =>
                Linking.openURL(
                  "mailto:feedback.nexus.app@gmail.com?subject=Feedback-Mail"
                )
              }
            />
          </Section>

          {/* LEGAL */}
          <Section title="Rechtliches" colors={colors} fonts={fonts}>
            <SettingItem
              icon="info"
              label="Lizenzen"
              bg={colors.iconBg.neutral}
              onPress={launchNotice}
              showDivider
            />
            <SettingItem
              icon="lock"
              label="Datenschutzerklärung"
              bg={colors.iconBg.primary}
              onPress={() => setIsLicenseModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="shield"
              label="AGB"
              bg={colors.iconBg.exam}
              onPress={() => setIsLicenseModalVisible(true)}
              showDivider
            />
            <SettingItem
              icon="clipboard"
              label="Impressum"
              bg={colors.iconBg.success}
              onPress={() =>
                Snackbar.show({
                  text: "Der Termin wurde erfolgreich gelöscht.",
                  duration: 4500,
                  action: {
                    text: "Rückgängig ↺",
                    textColor: colors.success,
                    onPress: () => {
                      console.log("hello");
                    },
                  },
                })
              }
            />
          </Section>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logout,
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: colors.warning,
              },
            ]}
          >
            <Icon.Feather name="log-out" size={22} color="white" />
            <Text style={[styles.logoutText, { fontFamily: fonts.semibold }]}>Abmelden</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text + "99", fontFamily: fonts.regular }]}>
              Version {version}
            </Text>
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
        <PortraylModal
          visible={isPortraylModalVisible}
          onClose={() => setIsPortraylModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

const Section = ({ title, children, colors }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.border,
        },
      ]}
    >
      {children}
    </View>
  </View>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginBottom: 10,
  },
  card: {
    borderRadius: 25,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 22,
    paddingVertical: 4,
  },
  logout: {
    marginTop: 26,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 16,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 5,
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
    fontSize: 13,
    marginBottom: 2,
  },
  logo: {
    marginTop: 8,
    width: 30,
    height: 30,
  },
});
