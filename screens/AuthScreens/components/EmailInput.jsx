import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const EmailInput = React.memo(({ value, onChangeText, error }) => {
  const { colors, radius, fonts } = useTheme();

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text, fontFamily: fonts.semibold }]}>E-Mail</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, fontFamily: fonts.regular, borderRadius: radius.md },
          error && { borderColor: colors.warning },
        ]}
        placeholder="deine@email.de"
        placeholderTextColor={colors.text + "99"}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.warning, fontFamily: fonts.regular }]}>{error}</Text>
      )}
    </View>
  );
});


EmailInput.displayName = 'EmailInput';

export default EmailInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    padding: 14,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});