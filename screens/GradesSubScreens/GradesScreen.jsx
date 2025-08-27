import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import FadeInTab from "../../components/General/FadeInTab";

const GradesScreen = function () {
  const { colors, fonts, spacing } = useTheme();

  return (
    <FadeInTab>
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background, padding: spacing.lg },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text, fontFamily: fonts.bold },
        ]}
      >
        Coming Soon...
      </Text>
    </ScrollView>
    </FadeInTab>
  );
};

export default GradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25 ,
  },
});
