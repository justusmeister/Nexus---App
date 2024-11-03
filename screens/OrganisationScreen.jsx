import React from "react";
import { StyleSheet, Text, View } from "react-native";

const OrganisationScreen = function () {
  return (
    <View
      style={ styles.container }
    >
      <Text>Settings!</Text>
    </View>
  );
};

export default OrganisationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEEF6",
  },
});
