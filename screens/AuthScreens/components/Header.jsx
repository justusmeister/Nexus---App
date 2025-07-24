import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "../styles/RegistrationStyles";

const Header = React.memo(({ onBack }) => (
  <View style={styles.topSection}>
    <Pressable
      onPress={onBack}
      style={({ pressed }) => [
        styles.backButton,
        { opacity: pressed ? 0.6 : 1 },
      ]}
      hitSlop={12}
    >
      <Icon.Feather name="arrow-left" size={22} color="black" />
    </Pressable>

    <View style={styles.header}>
      <Text style={styles.title}>Registrieren 🎉</Text>
      <Text style={styles.subtitle}>Erstelle ein neues Konto</Text>
    </View>
  </View>
));

Header.displayName = 'Header';

export default Header;