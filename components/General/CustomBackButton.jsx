import { Pressable, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { memo } from "react";

const CustomBackButton = ({ onPress }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress || navigation.goBack}
      style={({ pressed }) => [
        styles.backButton,
        {
          opacity: pressed ? 0.6 : 1,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      hitSlop={12}
    >
      <Icon.Feather name="arrow-left" size={22} color={colors.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    padding: 6,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default memo(CustomBackButton);
