import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const PasswordInput = React.memo(({
  value,
  onChangeText,
  showPassword,
  onToggleVisibility,
  onToggleHelp,
  error
}) => {
  const { colors, fonts, radius } = useTheme();

  return (
    <View style={styles.inputContainer}>
      <View style={styles.passwordLabelRow}>
        <Text style={[styles.label, { color: colors.text, fontFamily: fonts.semibold }]}>Passwort</Text>
        <Pressable onPress={onToggleHelp} hitSlop={10}>
          <Icon.Feather
            name="alert-circle"
            size={18}
            color={ colors.text + "99" }
            style={{ marginLeft: 4, marginBottom: 8 }}
          />
        </Pressable>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input,
            { borderColor: colors.border, color: colors.text, fontFamily: fonts.regular, borderRadius: radius.md },
             error && { borderColor: colors.warning }]}
          placeholder="••••••••"
          placeholderTextColor={colors.text + "99"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          textContentType="password"
          autoComplete="password-new"
          passwordRules="minlength: 8; required: digit;"
        />
        <Pressable
          style={styles.eyeIcon}
          onPress={onToggleVisibility}
          hitSlop={10}
        >
          <Icon.Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={colors.text + "99"}
          />
        </Pressable>
      </View>

      {error && <Text style={[styles.errorText, { color: colors.warning, fontFamily: fonts.regular }]}>{error}</Text>}
    </View>
  );
});


PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
  },
});