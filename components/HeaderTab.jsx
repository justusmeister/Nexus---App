import React from "react";
import * as Icon from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderTab = function ({ title }) {
  const navigation = useNavigation();
  
  return (
    <BlurView tint="light" intensity={100} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onPress={() => {
          navigation.getParent().navigate("SettingsScreen");
        }}
        style={{ marginBottom: 10, marginRight: 25 }}
      >
        <Icon.Ionicons name="settings" size={31} />
      </Pressable>
    </BlurView>
  );
};

export default HeaderTab;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    position: "relative",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 0.5,
  },
  title: {
    marginBottom: 10,
    marginLeft: 25,
    fontSize: 26,
    fontWeight: "500",
  },
});
