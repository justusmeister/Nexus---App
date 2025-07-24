import React from "react";
import {
  ScrollView,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { styles } from "./styles";

const ModalContent = ({
  editing,
  description,
  setDescription,
  setMultiInputFocused,
}) => {
  const handleDescriptionFocus = () => {
    setMultiInputFocused(true);
  };

  const handleDescriptionBlur = () => {
    setMultiInputFocused(false);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Pressable>
        <Text style={styles.taskTextHeader}>Beschreibung:</Text>
        <TextInput
          style={[
            styles.taskText,
            styles.inputStyle,
            editing && styles.underlineInput,
            editing && { paddingVertical: 6 },
          ]}
          multiline
          numberOfLines={3}
          maxLength={200}
          value={description}
          onChangeText={setDescription}
          editable={editing}
          onFocus={handleDescriptionFocus}
          onBlur={handleDescriptionBlur}
        />
      </Pressable>
    </ScrollView>
  );
};

export default ModalContent;