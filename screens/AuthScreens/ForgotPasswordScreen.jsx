import React from "react";
import { StyleSheet, View, Text } from "react-native";
const ForgotPasswordScreen = function ({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Hallo ich bins der Peta</Text>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  onboardingStyle: {
    paddingHorizontal: 15,
  },
});
