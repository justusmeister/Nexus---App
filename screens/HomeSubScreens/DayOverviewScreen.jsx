import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import FullScreenModalHeader from "../../components/General/FullScreenModalHeader";

const DayOverviewScreen = function ({ navigation }) {
  return (
    <View style={styles.container}>
      <FullScreenModalHeader title="Tagesübersicht" onClose={() => navigation.goBack()} />
    </View>
  );
};

export default DayOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
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
