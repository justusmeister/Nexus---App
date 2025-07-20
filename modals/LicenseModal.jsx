import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const LicenseModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="#333" />
              </Pressable>

              <View style={styles.header}>
                <Feather name="info" size={22} color="#4a4a4a" />
                <Text style={styles.headerText}>Impressum & Lizenzen</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.body}>
                <Text style={styles.comingSoonText}>coming soon...</Text>
                <Text style={styles.subText}>
                  Hier findest du bald Informationen zu Datenschutz, AGB, Lizenzen und Impressum.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LicenseModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: RFPercentage(2.4),
    fontWeight: "700",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  comingSoonText: {
    fontSize: RFPercentage(2.5),
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  subText: {
    fontSize: RFPercentage(1.9),
    textAlign: "center",
    color: "#777",
    lineHeight: 22,
  },
});
