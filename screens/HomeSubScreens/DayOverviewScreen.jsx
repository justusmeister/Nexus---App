import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import FullScreenModalHeader from "../../components/General/FullScreenModalHeader";
import { useTheme } from "@react-navigation/native";

const DayOverviewScreen = function ({ navigation }) {
  const { colors, fonts } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FullScreenModalHeader title="Tagesübersicht" onClose={() => navigation.goBack()} />
      <Button title="test" onPress={() => navigation.navigate("AuthStack", {
      screen: "ConfigurationCarusselScreen",
    })} />
    </View>
  );
};

export default DayOverviewScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
