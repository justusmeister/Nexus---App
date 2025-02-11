import { Pressable } from "react-native";
import * as Icon from "@expo/vector-icons";

const SingleRadioButton = function ({
  value,
  onPress,
  size = 25,
  color = "#333",
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      hitSlop={8}
    >
      <Icon.MaterialIcons
        name={value ? "radio-button-checked" : "radio-button-unchecked"}
        size={size}
        color={color}
      />
    </Pressable>
  );
};

export default SingleRadioButton;
