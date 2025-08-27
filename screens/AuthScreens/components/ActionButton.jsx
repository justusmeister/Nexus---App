import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const ActionButton = React.memo(({ onPress, loading, title }) => {
  const { colors, radius, fonts } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        { backgroundColor: colors.primary, borderRadius: radius.lg },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={[styles.buttonText, { color: colors.background, fontFamily: fonts.semibold }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});


ActionButton.displayName = 'ActionButton';

export default ActionButton;

export const styles = StyleSheet.create({
  primaryButton: {
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
  },
});