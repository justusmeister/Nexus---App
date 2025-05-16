import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import * as Icon from "@expo/vector-icons";

const SettingItem = ({ icon, label, onPress, bg = "#888", showDivider }) => {
  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.item,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={onPress}
      >
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <Icon.MaterialIcons name={icon} size={20} color="white" />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
      {showDivider && <View style={styles.divider} />}
    </>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  label: {
    marginLeft: 16,
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#bcbcbc",
    marginLeft: 56,
    marginRight: 16,
  },
});

