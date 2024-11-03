import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Platform } from "react-native";
import HeaderStack from "../components/HeaderStack";
import HeaderSettings from "../components/HeaderSettings";

const SettingsScreen = function ({ navigation }) {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <HeaderSettings
          title="Einstellungen"
          settingsOnPress={() => navigation.goBack()}
        />
      ) : (
        <HeaderStack
          title="Einstellungen"
          onPress={() => navigation.goBack()}
        />
      )}
      <Text>Moin</Text>
      <StatusBar
        style={Platform.OS === "ios" ? "light" : "auto"}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
