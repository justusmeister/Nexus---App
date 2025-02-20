import { useLayoutEffect, useState, useRef } from "react";
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
  Switch,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Toast from "react-native-toast-message";

const GenericScreen = function ({ navigation }) {
  const [isHomeworkModalVisible, setIsHomeworkModalVisible] = useState(false);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;

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

    if (user) fetchHomework(params.subject);
  }, [navigation]);

  const fetchHomework = async (subject) => {
    if (user) {
      try {
        const subjectRef = doc(firestoreDB, "subjects", user.uid + subject);
        const homeworkRef = collection(subjectRef, "homework");

        const q = query(homeworkRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);

        const fetchedHomework = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHomeworkList(fetchedHomework);
      } catch (error) {
        console.error("Fehler beim Abrufen der Hausaufgabenliste:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addHomework = async (title, startDate, dueDate, description) => {
    if (user) {
      try {
        setLoading(true);

        const subjectRef = doc(
          firestoreDB,
          "subjects",
          user.uid + params.subject
        );
        const homeworkCollectionRef = collection(subjectRef, "homework");

        await addDoc(homeworkCollectionRef, {
          title: title,
          startDate: startDate,
          dueDate: dueDate,
          description: description,
          timestamp: serverTimestamp(),
        });
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: e,
          visibilityTime: 4000,
        });
      } finally {
        fetchHomework(params.subject);
      }
    }
  };

  const addDeadline = async (subject, dueDate) => {
    
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.deadlineResult,
        {
          shadowColor: 2 === 1 ? "#e02225" : "black",
          shadowOpacity: 2 === 1 ? 1 : 0.3,
          shadowRadius: 2 === 1 ? 9 : 4,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          setIsHomeworkModalVisible(true);
        }}
        style={styles.deadlineTaskBox}
      >
        <Icon.MaterialIcons name="task" size={28} color="black" />
        <View style={styles.deadlineDetails}>
          <Text style={styles.subjectText}>{item.title}:</Text>
          <Text style={styles.taskText}>{item.description}</Text>
          <Text
            style={[
              styles.dueDateText,
              {
                color: 2 === 1 ? "#e02225" : "grey",
              },
            ]}
          >
            <Text style={styles.dueDateDescriptionText}>Abgabedatum:</Text>
            {item.dueDate
              ? new Date(item.dueDate.seconds * 1000).toLocaleDateString(
                  "de-DE",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  }
                )
              : "Datum nicht angegeben"}
          </Text>
        </View>
      </Pressable>
    </View>
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
          ) : null
        }
      />
      <HomeworkDetailModal
        visible={isHomeworkModalVisible}
        onClose={() => setIsHomeworkModalVisible(false)}
      />
      <InputModal
        visible={isInputModalVisible}
        onClose={() => setIsInputModalVisible(false)}
        addHomework={addHomework}
        addDeadline={addDeadline}
        subject={params.subject}
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

const InputModal = ({
  visible,
  onClose,
  addHomework,
  addDeadline,
  subject,
}) => {
  const [multiInputFocused, setMultiInputFocused] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDeadline, setIsDeadline] = useState(false);
  const titleInputRef = useRef(null);

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withSpring(multiInputFocused ? 150 : 0, {
        damping: 15,
        stiffness: 100,
        mass: 1,
        easing: Easing.ease,
      }),
    };
  });

  const showDatePicker = (mode, date, dateType) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: mode,
        onChange: (event, selectedDate) => {
          if (selectedDate)
            dateType === "due"
              ? setDueDate(selectedDate)
              : setStartDate(selectedDate);
        },
      });
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, animatedModalStyle]}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View style={styles.modalHeader}>
                <TextInput
                  ref={titleInputRef}
                  autoFocus
                  style={styles.deadlineModalTitle}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  placeholder="Titel..."
                  placeholderTextColor={"#c2c2c2"}
                />
                <Text style={styles.motivationText}>Aufgabedatum</Text>
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "default" : "spinner"}
                    onChange={(event, day) => day && setStartDate(day)}
                  />
                ) : (
                  <Pressable
                    onPress={() => showDatePicker("date", startDate, "start")}
                  >
                    <Text style={styles.dateText}>
                      {startDate.toLocaleDateString()}
                    </Text>
                  </Pressable>
                )}

                <Text style={styles.motivationText}>Abgabedatum: </Text>
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "default" : "spinner"}
                    onChange={(event, day) => day && setDueDate(day)}
                  />
                ) : (
                  <Pressable
                    onPress={() => showDatePicker("date", dueDate, "due")}
                  >
                    <Text style={styles.dateText}>
                      {dueDate.toLocaleDateString()}
                    </Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.divider} />
              <InputField
                onFocused={() => setMultiInputFocused(true)}
                onBlur={() => setMultiInputFocused(false)}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
              <View style={styles.deadlineSwitchBox}>
                <Text style={styles.deadlineSwitchText}>
                  Als Frist speichern ?
                </Text>
                <Switch
                  value={isDeadline}
                  onValueChange={() => setIsDeadline((prev) => !prev)}
                />
              </View>
              <View style={styles.finishButtonView}>
                <Pressable
                  style={styles.finishButton}
                  onPress={() => {
                    addHomework(title, startDate, dueDate, description);
                    isDeadline ? addDeadline(subject) : null;
                    onClose();
                  }}
                >
                  <Text style={styles.finishButtonText}>Speichern</Text>
                </Pressable>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const InputField = ({ onFocused, onBlur, onChangeText }) => {
  const [text, setText] = useState("");
  const scrollViewRef = useRef(null);

  return (
    <View style={styles.containerInput}>
      <Text style={styles.charCount}>{text.length} / 200</Text>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.input}
          placeholder="Gib deinen Text ein..."
          multiline
          maxLength={200}
          onFocus={() => onFocused()}
          onBlur={() => onBlur()}
          value={text}
          onChangeText={(text) => {
            setText(text);
            onChangeText(text);
          }}
        />
      </ScrollView>
    </View>
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
    width: "90%",
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalHeader: {
    marginBottom: 15,
    backgroundColor: "#fceded",
    padding: 12,
    borderRadius: 8,
  },
  deadlineModalTitle: {
    fontWeight: "700",
    fontSize: 18,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  finishButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
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
  containerInput: {},
  scrollView: {
    maxHeight: 140,
    borderRadius: 15,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    fontSize: 14,
    color: "#666",
    margin: 2,
  },
  deadlineResult: {
    width: "100%",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  deadlineTaskBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#e02225",
  },
  deadlineDetails: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subjectText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  taskText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  dueDateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "grey",
  },
  dueDateDescriptionText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  deadlineSwitchBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
    marginVertical: 15,
  },
  deadlineSwitchText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
