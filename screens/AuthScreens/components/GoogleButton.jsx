import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const GoogleButton = React.memo(({ text }) => {
  const { colors, fonts, spacing, radius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.googleButton,
        {
          borderColor: colors.border,
          padding: spacing.md,
          borderRadius: radius.lg,
        },
      ]}
    >
      <Icon.FontAwesome name="google" size={20} color="#DB4437" />
      <Text
        style={[
          styles.googleButtonText,
          {
            color: colors.text,
            fontFamily: fonts.semibold,
            marginLeft: spacing.sm,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
});

GoogleButton.displayName = "GoogleButton";

export default GoogleButton;

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1.5,
  },
  googleButtonText: {
    fontSize: 16,
  },
});