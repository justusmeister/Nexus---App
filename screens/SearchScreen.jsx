import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HeaderTab from "../components/HeaderTab";

const SearchScreen = function () {
  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <HeaderTab title="Suche" />
      <StatusBar />
      <Text>SearchScreen</Text>
    </View>
  );
};

export default SearchScreen;
  