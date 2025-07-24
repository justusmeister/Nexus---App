import React from "react";
import {
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "./styles";

const ModalButtons = ({
  editing,
  loading,
  saveLoading,
  onEdit,
  onDelete,
  onCancel,
  onSave,
}) => {
  if (editing) {
    return (
      <View style={styles.buttonsBottomBox}>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
          onPress={onCancel}
        >
          <Text style={[styles.editButtonsText, { color: "#8E8E93" }]}>
            Abbrechen
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
          onPress={onSave}
          disabled={saveLoading}
        >
          <Text style={[styles.editButtonsText, { color: "#0066cc" }]}>
            {saveLoading ? "Speichert..." : "Speichern"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonsBottomBox}>
      <Pressable
        style={({ pressed }) => [
          styles.editButton,
          { opacity: pressed ? 0.4 : 1 },
        ]}
        disabled={loading}
        onPress={onEdit}
      >
        <View style={styles.deleteButtonSubBox}>
          <Icon.Feather name="edit-3" size={22} color="white" />
        </View>
      </Pressable>
      
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          { opacity: pressed ? 0.4 : 1 },
        ]}
        disabled={loading}
        onPress={onDelete}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View style={styles.deleteButtonSubBox}>
            <Text style={styles.deleteButtonText}>Löschen</Text>
            <Icon.Feather name="trash-2" size={22} color="white" />
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default ModalButtons;