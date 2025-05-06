import React from "react";
import { ScrollView, Text, StyleSheet, Image } from "react-native";

const GradesScreen = function () {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Coming Soon...</Text>
    </ScrollView>
  );
};

export default GradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
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
