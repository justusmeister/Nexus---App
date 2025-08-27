import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const Divider = React.memo(() => {
  const { colors, fonts, spacing } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        { marginVertical: spacing.md }
      ]}
    >
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: colors.border }
        ]}
      />
      <Text
        style={[
          styles.dividerText,
          {
            color: colors.text + "99", 
            fontFamily: fonts.semibold,
            paddingHorizontal: spacing.sm
          }
        ]}
      >
        oder
      </Text>
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: colors.border }
        ]}
      />
    </View>
  );
});

Divider.displayName = "Divider";

export default Divider;

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
  },
  dividerText: {
    fontSize: 12,
  },
});
