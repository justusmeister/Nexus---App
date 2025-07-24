import React from "react";
import { TouchableOpacity, Text } from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "../styles/RegistrationStyles";

const GoogleButton = React.memo(({ text }) => (
  <TouchableOpacity style={styles.googleButton}>
    <Icon.FontAwesome name="google" size={20} color="#DB4437" />
    <Text style={styles.googleButtonText}>{text}</Text>
  </TouchableOpacity>
));

GoogleButton.displayName = 'GoogleButton';

export default GoogleButton;