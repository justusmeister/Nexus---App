import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "../styles/RegistrationStyles";

const PasswordInput = React.memo(({ 
  value, 
  onChangeText, 
  showPassword, 
  onToggleVisibility, 
  onToggleHelp, 
  error 
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.passwordLabelRow}>
      <Text style={styles.label}>Passwort</Text>
      <Pressable onPress={onToggleHelp} hitSlop={10}>
        <Icon.Feather
          name="alert-circle"
          size={18}
          color="#888"
          style={{ marginLeft: 4, marginBottom: 8 }}
        />
      </Pressable>
    </View>
    <View style={styles.passwordContainer}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="••••••••"
        placeholderTextColor="#888"
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
          color="#888"
        />
      </Pressable>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
));

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;