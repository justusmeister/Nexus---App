import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { styles } from "../styles/RegistrationStyles";

const ActionButton = React.memo(({ onPress, disabled, loading, title }) => (
  <TouchableOpacity
    style={[styles.primaryButton, disabled && styles.disabledButton]}
    onPress={onPress}
    disabled={disabled}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>{title}</Text>
    )}
  </TouchableOpacity>
));

ActionButton.displayName = 'ActionButton';

export default ActionButton;