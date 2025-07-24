import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "../styles/RegistrationStyles";

const EmailInput = React.memo(({ value, onChangeText, error }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>E-Mail</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder="deine@email.de"
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      keyboardType="email-address"
      autoCapitalize="none"
      textContentType="emailAddress"
      autoComplete="email"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
));

EmailInput.displayName = 'EmailInput';

export default EmailInput;