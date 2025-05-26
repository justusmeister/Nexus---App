import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";
import { Alert } from "react-native";

/**
 * Formatiert Byte-Größen für menschenlesbare Anzeige
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Wandelt MIME-Typen in Feather-Icons um
 */
export const mimeTypeToFeatherIcon = (mimeType) => {
  if (!mimeType) return "file";

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "music";
  if (mimeType === "application/pdf") return "file-text";
  if (
    mimeType === "application/msword" ||
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "file-text"; // Word-Dokument
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return "bar-chart"; // Excel
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return "layers"; // PowerPoint
  if (mimeType.startsWith("text/")) return "file-text";

  return "file"; // Fallback
};

/**
 * Prüft und fordert Berechtigungen für Kamera und Mediathek an
 */
const requestPermissions = async () => {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (
    cameraPermission.status !== "granted" ||
    mediaPermission.status !== "granted"
  ) {
    Alert.alert(
      "Berechtigung benötigt",
      "Bitte erlaube Kamera- und Fotozugriff."
    );
    return false;
  }
  return true;
};

/**
 * Öffnet die Kamera und gibt ein Attachment-Objekt zurück
 */
export const openCamera = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 0.7,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const asset = result.assets[0];
    return {
      type: "image",
      uri: asset.uri,
      name: "Kameraaufnahme.jpg",
      size: asset.fileSize || 0,
    };
  }
  return null;
};

/**
 * Öffnet die Galerie und gibt ein Attachment-Objekt zurück
 */
export const openGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const asset = result.assets[0];
    return {
      type: asset.type || "image",
      uri: asset.uri,
      name: asset.fileName || "Galeriebild.jpg",
      size: asset.fileSize || 0,
    };
  }
  return null;
};

/**
 * Öffnet den Dokument-Picker und gibt ein Attachment-Objekt zurück
 */
export const openAttachment = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result?.assets?.length) {
      const asset = result.assets[0];
      const iconType = mimeTypeToFeatherIcon(asset.mimeType || asset.type || "");

      return {
        type: iconType,
        uri: asset.uri,
        name: asset.name,
        size: asset.size || 0,
      };
    } else if (result?.type === "success" && result?.uri) {
      const iconType = mimeTypeToFeatherIcon(
        result.mimeType || "application/octet-stream"
      );

      return {
        type: iconType,
        uri: result.uri,
        name: result.name || "Dokument",
        size: result.size || 0,
      };
    }
  } catch (error) {
    console.error("Fehler beim Öffnen des Anhangs:", error);
  }
  return null;
};

/**
 * Öffnet eine Datei mit dem entsprechenden nativen Viewer
 */
export const openNativeFile = async (uri) => {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${uri.split("/").pop()}`;

    // Datei temporär in den Cache kopieren (FileViewer benötigt lokalen Pfad)
    await FileSystem.copyAsync({
      from: uri,
      to: fileUri,
    });

    await FileViewer.open(fileUri, { showOpenWithDialog: true });
  } catch (error) {
    console.error("Fehler beim Öffnen der Datei:", error);
  }
};