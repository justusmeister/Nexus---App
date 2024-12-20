import { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Icon from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";

const SettingsScreen = function ({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={({}) => navigation.goBack()}>
            <Icon.Ionicons name="close-circle" size={33} color="grey" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>TEST</Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
