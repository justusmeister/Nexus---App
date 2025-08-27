import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import OnboardingFlow from "../../components/OnboardingFlow/OnboardingFlow";
import { useNavigation } from "@react-navigation/native";

const ConfigurationCarusselScreen = () => {
  const navigation = useNavigation();

  return (
    <OnboardingFlow onComplete={() => navigation.navigate("Tabs", { screen: "DayOverview" })} />
  );
};

export default ConfigurationCarusselScreen;