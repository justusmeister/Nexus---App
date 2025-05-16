import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const AttachmentBar = ({ onCameraPress, onGalleryPress, onFilePress, onScanPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Anhänge:</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={onCameraPress}>
          <Feather name="camera" size={25} color="#333" />
          <Text style={styles.text}>Kamera</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onGalleryPress}>
          <Feather name="image" size={25} color="#333" />
          <Text style={styles.text}>Bilder</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onFilePress}>
          <Feather name="file" size={25} color="#333" />
          <Text style={styles.text}>Dateien</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onScanPress}>
          <Feather name="file-text" size={25} color="#333" />
          <Text style={styles.text}>Scannen</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AttachmentBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderRadius: 12,
  },
  text: {
    fontSize: RFPercentage(1.6),
    color: "#444",
    fontWeight: "500",
    marginTop: 6,
  },
});
