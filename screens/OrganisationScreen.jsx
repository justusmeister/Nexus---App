import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HeaderTab from "../components/HeaderTab";

const OrganisationScreen = function () {
  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <HeaderTab title="Organisation" />
      <Text>Settings!</Text>
      <StatusBar />
    </View>
  );
};

export default OrganisationScreen;
