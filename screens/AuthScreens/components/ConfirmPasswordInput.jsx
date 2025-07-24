
// components/ConfirmPasswordInput.js
import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "../styles/RegistrationStyles";

const ConfirmPasswordInput = React.memo(({ 
  value, 
  onChangeText, 
  showPassword, 
  onToggleVisibility, 
  error 
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Passwort wiederholen</Text>
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

ConfirmPasswordInput.displayName = 'ConfirmPasswordInput';

export default ConfirmPasswordInput;