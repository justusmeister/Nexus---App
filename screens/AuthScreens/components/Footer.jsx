import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/RegistrationStyles";

const Footer = React.memo(({ onNavigateToLogin }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Schon ein Konto?</Text>
    <TouchableOpacity onPress={onNavigateToLogin}>
      <Text style={styles.footerLink}>Anmelden</Text>
    </TouchableOpacity>
  </View>
));

Footer.displayName = 'Footer';

export default Footer;