import { Pressable } from "react-native";
import * as Icon from "@expo/vector-icons";
import { DarkTheme, LightTheme } from "../../constants/theme";
import { useThemePreference } from "../../hooks/useThemePreference";

const SingleRadioButton = function ({
  value,
  onPress,
  size = 25,
  color, // optional
}) {
  const { colorScheme } = useThemePreference();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      hitSlop={8}
    >
      <Icon.MaterialIcons
        name={value ? "radio-button-checked" : "radio-button-unchecked"}
        size={size}
        color={ color || colorScheme === "dark" ? DarkTheme.colors.text : LightTheme.colors.text } 
      />
    </Pressable>
  );
};  

export default SingleRadioButton;
