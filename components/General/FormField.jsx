import { memo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const FormField = memo(function ({
  label,
  value,
  setValue,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  maxLength = 200,
  onFocus = () => {},
  onBlur = () => {},
  inputRef = null,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={multiline ? styles.descriptionField : styles.inputField}
        placeholder={placeholder}
        defaultValue={value}
        onEndEditing={(e) => setValue(e.nativeEvent.text)}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: RFPercentage(2.18),
  },
  descriptionField: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: RFPercentage(2.18),
    textAlignVertical: "top",
    maxHeight: 100,
  },
});

export default FormField;