import { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Icon from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const SettingsScreen = function ({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={({}) => navigation.goBack()}>
            <Icon.Ionicons name="close-circle" size={33} color="grey" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentInsetAdjustmentBehavior="automatic"
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
                  backgroundColor: "#596270",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => navigation.navigate("PointsScreen")}
            >
              <Icon.MaterialIcons
                name="account-circle"
                size={26}
                color={"white"}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Accountverwaltung</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  backgroundColor: "#f5a002",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => {
                navigation.navigate("GradesScreen");
              }}
            >
              <Icon.MaterialIcons
                name="delete-forever"
                size={26}
                color={"white"}
                style={styles.buttonIcon}
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
                  backgroundColor: "#596270",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => navigation.navigate("PointsScreen")}
            >
              <Icon.MaterialIcons
                name="nightlight"
                size={26}
                color={"white"}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Appdarstellung</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pressable,
                {
                  backgroundColor: "#f5a002",
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => {
                navigation.navigate("GradesScreen");
              }}
            >
              <Icon.MaterialIcons
                name="notifications"
                size={26}
                color={"white"}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Mitteilungsverwaltung</Text>
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
                  backgroundColor: "#596270",
                  borderRadius: 15,
                },
              ]}
              activeOpacity={0.4}
              onPress={() => navigation.navigate("PointsScreen")}
            >
              <Icon.MaterialIcons
                name="info-outline"
                size={26}
                color={"white"}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Lizenzen</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    backgroundColor: "#EFEEF6",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    width: "100%",
    marginTop: 30,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: "600",
    padding: 15,
  },
  buttonIcon: {
    marginLeft: 15,
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
    fontSize: 14,
    fontWeight: "500",
  },
  logo: {
    marginLeft: 8,
    width: 30,
    height: 30,
  },
});
