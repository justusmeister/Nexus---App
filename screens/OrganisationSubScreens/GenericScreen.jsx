import { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const GenericScreen = function ({ navigation }) {
  const [isHomeworkModalVisible, setIsHomeworkModalVisible] = useState(false);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { params } = route;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params.subject,
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsInputModalVisible(true)}
        >
          <Icon.AntDesign name="pluscircle" size={35} color="#3a5f8a" />
        </TouchableOpacity>
      ),
    });

    setTimeout(() => {
      setHomeworkList([]); 
      setLoading(false);
    }, 2000); 
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setIsHomeworkModalVisible(true)}
      style={styles.homeworkItem}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={homeworkList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" color="#333" />
          ) : homeworkList.length < 1 ? (
            <Text style={styles.emptyListText}>
              Keine Hausaufgaben vorhanden
            </Text>
          ) : (
            <View></View>
          )
        }
      />
      <HomeworkDetailModal
        visible={isHomeworkModalVisible}
        onClose={() => setIsHomeworkModalVisible(false)}
      />
      <InputModal
        visible={isInputModalVisible}
        onClose={() => setIsInputModalVisible(false)}
      />
    </View>
  );
};

export default GenericScreen;

const HomeworkDetailModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View style={styles.modalHeader}>
                <Text style={styles.deadlineModalTitle}>Titel</Text>
                <Text style={styles.remainingTimeText}>Aufgabedatum</Text>
                <Text style={styles.motivationText}>Abgabedatum: </Text>
              </View>
              <View style={styles.divider} />
              <ScrollView>
                <Text style={styles.taskTextHeader}>Aufgabe:</Text>
                <Text style={styles.taskText}></Text>
              </ScrollView>
              <View style={styles.finishButtonView}>
                <Pressable style={styles.finishButton} onPress={onClose}>
                  <Text style={styles.finishButtonText}>Abschließen</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const InputModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View style={styles.modalHeader}>
                <TextInput style={styles.deadlineModalTitle}>Titel</TextInput>
                <Text style={styles.remainingTimeText}>Aufgabedatum</Text>
                <Text style={styles.motivationText}>Abgabedatum: </Text>
              </View>
              <View style={styles.divider} />
              <ScrollView keyboardDismissMode="on-drag">
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={100}
                  style={styles.taskText}
                >
                  HA:
                </TextInput>
              </ScrollView>
              <View style={styles.finishButtonView}>
                <Pressable style={styles.finishButton} onPress={onClose}>
                  <Text style={styles.finishButtonText}>Abschließen</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    height: "40%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 7,
    right: 7,
    zIndex: 1,
  },
  modalHeader: {
    marginBottom: 10,
    backgroundColor: "#fceded",
    padding: 10,
    borderRadius: 8,
  },
  deadlineModalTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  remainingTimeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#d13030",
  },
  motivationText: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
    padding: 10,
  },
  finishButtonView: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  finishButton: {
    width: 120,
    height: 40,
    backgroundColor: "#429e1b",
    borderRadius: 15,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
  },
  finishButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  taskTextHeader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  homeworkItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  emptyListText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    marginRight: 15,
  },
});
