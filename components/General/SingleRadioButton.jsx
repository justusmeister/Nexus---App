import { Pressable } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const SingleRadioButton = function ({
  value,
  onPress,
  size = 25,
  color, // optional
}) {
  const { colors } = useTheme(); 

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      hitSlop={8}
    >
      <Icon.MaterialIcons
        name={value ? "radio-button-checked" : "radio-button-unchecked"}
        size={size}
        color={color || colors.text} 
      />
    </Pressable>
  );
};

export default SingleRadioButton;
