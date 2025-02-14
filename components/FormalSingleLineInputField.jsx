import { StyleSheet, TextInput, View } from "react-native";

const FormalSignleLineInputField = function ({ value, onChange, placeholder, style, autoOpen }) {
  return (
    <View>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={[styles.inputStyle, style]}
        autoFocus={autoOpen}
      />
    </View>
  );
};

export default FormalSignleLineInputField;

const styles = StyleSheet.create({
  inputStyle: {},
});
