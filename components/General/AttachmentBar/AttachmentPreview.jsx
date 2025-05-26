import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatBytes } from "./utils/attachmentService";

const AttachmentPreview = memo(function ({ item, index,  isEditing = true, onPress, onRemove }) {
  const isImage = item.type === "image";

  return (
    <View style={styles.attachmentItem}>
      <TouchableOpacity onPress={onPress} style={styles.previewContainer}>
        {isImage ? (
          <Image source={{ uri: item.uri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.iconWrapper}>
            <Feather name={item.type} size={28} color="#555" />
          </View>
        )}
        { isEditing && <Feather
          name="x-circle"
          size={20}
          color="#333"
          style={styles.removeIcon}
          onPress={onRemove}
        />}
      </TouchableOpacity>
      <Text style={styles.attachmentSize}>{formatBytes(item.size)}</Text>
      <Text style={styles.attachmentName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  attachmentItem: {
    width: 80,
    alignItems: "center",
    marginRight: 10,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  attachmentSize: {
    fontSize: 12,
    color: "#666",
  },
  attachmentName: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    maxWidth: 100,
  },
  previewContainer: {
    padding: 5,
  },
  removeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 1,
    elevation: 3,
  },
});

export default AttachmentPreview;