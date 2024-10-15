import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Platform } from "react-native";

const SettingsScreen = function () {
    return (
      <View style={styles.container} >
        <Text>Moin</Text>
        <StatusBar barStyle={ Platform.OS === "ios" ? "light-content" : "dark-content" } />
      </View>
    );
  };

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });