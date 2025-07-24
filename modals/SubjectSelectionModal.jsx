import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import SelectionSubjectItem from "../components/General/SelectionSubjectItem"; 
import { getAuth } from "firebase/auth";
import { useSubjects } from "../hooks/useSubjects";

// Übergabe: { visible, onClose, loading, data }
// data = Array mit { id, color, icon, subject }
// SelectionSubjectItem: eigene Komponente für jedes Fach

const data =  [
    {
        id: 0,
        color: "red",
        icon: "pencil",
        subject: "Deutsch"
    },
    {
        id: 1,
        color: "blue",
        icon: "book",
        subject: "Mathe"
    },
    {
        id: 2,
        color: "green",
        icon: "book",
        subject: "Bio"
    },
  ];

const SubjectSelectionModal = ({ visible, onClose }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const { subjects, loading } = useSubjects(user);

  const renderItem = ({ item }) => <SelectionSubjectItem item={item} />;

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Keine Fächer gefunden.</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Feather name="clipboard" size={22} color="#4a4a4a" />
                <Text style={styles.headerText}>Wähle ein Fach:</Text>
              </View>

              <View style={styles.divider} />

              {/* Inhalt */}
              {loading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color="#6C63FF" />
                </View>
              ) : (
                <FlatList
                  data={subjects}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={renderEmpty}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatlistContainer}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SubjectSelectionModal;

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "88%",
      height: "70%",
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 24,
      paddingBottom: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 8,
      position: "relative",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    headerText: {
      fontSize: RFPercentage(2.4),
      fontWeight: "700",
      color: "#333",
    },
    divider: {
      height: 1,
      backgroundColor: "#e0e0e0",
      marginBottom: 5,
    },
    loadingBox: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    flatlistContainer: {
      paddingBottom: 20,
    },
    emptyContainer: {
      paddingVertical: 30,
      alignItems: "center",
    },
    emptyText: {
      fontSize: RFPercentage(2),
      color: "#999",
    },
  });
  