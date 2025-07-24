import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/RegistrationStyles";

const Divider = React.memo(() => (
  <View style={styles.divider}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>oder</Text>
    <View style={styles.dividerLine} />
  </View>
));

Divider.displayName = 'Divider';

export default Divider;