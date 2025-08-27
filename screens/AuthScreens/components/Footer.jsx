import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const Footer = React.memo(({ question1, screenName, onNavigateToScreen }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.footer}>
      <Text style={{ color: colors.text + "AA", fontFamily: fonts.regular }}>{question1}</Text>
      <Pressable onPress={onNavigateToScreen} style={({ pressed }) => [
    {
      opacity: pressed ? 0.4 : 1, 
    },
  ]}>
        <Text style={{ color: colors.primary, fontFamily: fonts.semibold, marginLeft: 4 }}>
          {screenName}
        </Text>
      </Pressable>
    </View>
  );
});

Footer.displayName = 'Footer';

export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 60,
  },
});
