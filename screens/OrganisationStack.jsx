import React from "react";
import { StyleSheet, Text, View } from "react-native";

const OrganisationStack = function () {
  return (
    <View
      style={ styles.container }
    >
      <Text>Settings!</Text>
    </View>
  );
};

export default OrganisationStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEEF6",
  },
});
