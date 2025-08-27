import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const SettingItem = ({ icon, label, onPress, bg, showDivider }) => {
  const { colors, fonts } = useTheme();

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.item,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={onPress}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: bg || colors.primary },
          ]}
        >
          <Icon.Feather name={icon} size={18} color={"white"} />
        </View>
        <Text
          style={[
            styles.label,
            { color: colors.text, fontFamily: fonts?.regular },
          ]}
        >
          {label}
        </Text>
      </Pressable>
      {showDivider && (
        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />
      )}
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
    fontSize: 16,
    fontWeight: "500",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    marginLeft: 56,
    marginRight: 16,
  },
});
