import React from "react";
import { View, Text } from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "../styles/RegistrationStyles";

const CheckIcon = React.memo(({ active }) => (
  <Icon.Feather
    name={active ? "check-circle" : "circle"}
    size={18}
    color={active ? "#4CAF50" : "#999"}
    style={{ marginRight: 6 }}
  />
));

CheckIcon.displayName = 'CheckIcon';

const PasswordRequirements = React.memo(({ validation }) => (
  <View style={styles.requirementsContainer}>
    <View style={styles.requirementItem}>
      <CheckIcon active={validation.isLengthValid} />
      <Text style={styles.requirementText}>Mindestens 8 Zeichen</Text>
    </View>
    <View style={styles.requirementItem}>
      <CheckIcon active={validation.hasNumber} />
      <Text style={styles.requirementText}>Mindestens 1 Zahl</Text>
    </View>
  </View>
));

PasswordRequirements.displayName = 'PasswordRequirements';

export default PasswordRequirements;