import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const CheckIcon = React.memo(({ active }) => {
  const { colors, spacing, radius, fonts } = useTheme();

  return (
    <Icon.Feather
      name={active ? "check-circle" : "circle"}
      size={18}
      color={active ? colors.success : colors.border}
      style={{ marginRight: spacing.xs }}
    />
  );
});

CheckIcon.displayName = 'CheckIcon';

const PasswordRequirements = React.memo(({ validation }) => {
  const { colors, spacing, radius, fonts } = useTheme();

  return (
    <View style={[styles.requirementsContainer, { paddingHorizontal: spacing.sm }]}>
      <View style={[styles.requirementItem, { marginBottom: spacing.xs }]}>
        <CheckIcon active={validation.isLengthValid} />
        <Text
          style={[
            styles.requirementText,
            { color: colors.text, fontFamily: fonts.regular }
          ]}
        >
          Mindestens 8 Zeichen
        </Text>
      </View>
      <View style={styles.requirementItem}>
        <CheckIcon active={validation.hasNumber} />
        <Text
          style={[
            styles.requirementText,
            { color: colors.text, fontFamily: fonts.regular }
          ]}
        >
          Mindestens 1 Zahl
        </Text>
      </View>
    </View>
  );
});

PasswordRequirements.displayName = 'PasswordRequirements';

export default PasswordRequirements;

const styles = StyleSheet.create({
  requirementsContainer: {
    marginBottom: 24,
    marginTop: -12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementText: {
    fontSize: 13,
  },
});
