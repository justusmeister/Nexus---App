import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const GradesGenericScreen = function () {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coming Soon...</Text>
    </View>
  );
};

export default GradesGenericScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    maxWidth: 300,
  },
});
