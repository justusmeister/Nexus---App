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
  Keyboard,
  Animated,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Easing, useAnimatedStyle, withSpring } from "react-native-reanimated";
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
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { eventEmitter } from "../../eventBus";
import { checkDeadlineRemainingTime } from "../../externMethods/checkDeadlineRemainingTime";
import HomeworkModal from "../../modals/HomeworkModal";
import { SegmentedControl } from "../../components/SegmentedControl";

const GenericScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [isDetailedModalVisible, setIsDetailedModalVisible] = useState(false);
  const [homeworkItem, setHomeworkItem] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const buttonScale = useState(new Animated.Value(1))[0];

  const [selectedOption, setSelectedOption] = useState("Alle");

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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "";
    }
    const date = timestamp.toDate();
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
  };

  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(2000 + year, month - 1, day, 7, 0, 0);
  };

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
          status: doc.data().status || false,
          canDelete:
            checkDeadlineRemainingTime(formatTimestamp(doc.data().dueDate))
              .time === "delete"
              ? true
              : false,
        }));

        const currentDate = new Date();

        const upcomingDues = fetchedHomework
          .filter(
            (d) => parseDateString(formatTimestamp(d.dueDate)) >= currentDate
          )
          .sort(
            (a, b) =>
              parseDateString(formatTimestamp(a.dueDate)) -
              parseDateString(formatTimestamp(b.dueDate))
          );

        const pastDues = fetchedHomework
          .filter(
            (d) => parseDateString(formatTimestamp(d.dueDate)) < currentDate
          )
          .sort(
            (a, b) =>
              parseDateString(formatTimestamp(b.dueDate)) -
              parseDateString(formatTimestamp(a.dueDate))
          );

        const sortedHomework = [...upcomingDues, ...pastDues];

        setHomeworkList(sortedHomework);
        for (const homework of fetchedHomework) {
          if (homework.canDelete) {
            await deleteHomework(homework.id);
          }
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Hausaufgabenliste:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addHomework = async (
    title,
    startDate,
    dueDate,
    description,
    isDeadline
  ) => {
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
          status: false,
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
        isDeadline ? addDeadline(title, dueDate, description) : null;
      }
    }
  };

  const addDeadline = async (name, day, description) => {
    if (!user) return;

    try {
      const deadlineCollectionRef = collection(
        firestoreDB,
        "deadlines",
        user.uid,
        "deadlinesList"
      );

      await addDoc(deadlineCollectionRef, {
        name,
        day,
        description,
        timestamp: serverTimestamp(),
      });

      console.log("Frist erfolgreich hinzugefügt!");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: e.message || "Ein Fehler ist aufgetreten",
        visibilityTime: 4000,
      });
    } finally {
      eventEmitter.emit("refreshDeadlines");
    }
  };

  const deleteHomework = async (id) => {
    if (user) {
      try {
        const homeworkRef = doc(
          firestoreDB,
          "subjects",
          user.uid + params?.subject,
          "homework",
          id
        );

        await deleteDoc(homeworkRef);
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: "Beim Löschen der Hausaufgabe ist ein Fehler aufgetreten.",
          visibilityTime: 4000,
        });
        console.error("Fehler beim Löschen der Hausaufgabe:", e);
        setIsDetailedModalVisible(false);
      } finally {
        setIsDetailedModalVisible(false);
        fetchHomework(params?.subject);
      }
    }
  };

  const updateHomework = async (title, description, startDate, dueDate, id) => {
    console.log(
      `updateHomework ->`,
      title,
      "|",
      description,
      "|",
      startDate,
      "|",
      dueDate,
      "|",
      id
    );

    if (user) {
      setHomeworkList((prev) =>
        prev.map((hw) =>
          hw.id === id
            ? {
                ...hw,
                title: title,
                description: description,
                startDate: startDate,
                dueDate: dueDate,
              }
            : hw
        )
      );
      try {
        const homeworkRef = doc(
          firestoreDB,
          "subjects",
          user.uid + params?.subject,
          "homework",
          id
        );

        await setDoc(
          homeworkRef,
          {
            title: title,
            description: description,
            startDate: startDate,
            dueDate: dueDate,
            timestamp: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler hier:",
          text2: e.message || "Unbekannter Fehler",
          visibilityTime: 4000,
        });
      }
    }
  };

  const updateHomeworkStatus = async (id) => {
    if (user) {
      setHomeworkList((prev) =>
        prev.map((hw) => (hw.id === id ? { ...hw, status: true } : hw))
      );
      try {
        const homeworkRef = doc(
          firestoreDB,
          "subjects",
          user.uid + params?.subject,
          "homework",
          id
        );

        await setDoc(
          homeworkRef,
          {
            status: true,
          },
          { merge: true }
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: e.message || "Unbekannter Fehler",
          visibilityTime: 4000,
        });
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const handlePressIn = () => {
      setActiveAnimation(index);
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
      }).start(() => {
        setActiveAnimation(null);
      });
    };
    return (
      <Animated.View
        style={[
          {
            transform: [
              {
                scale: activeAnimation === index ? buttonScale : 1,
              },
            ],
          },
        ]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.deadlineResult,
            {
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              shadowColor:
                checkDeadlineRemainingTime(formatTimestamp(item.dueDate))
                  .isWithinTwoDays === 1 && !item.status
                  ? "#e02225"
                  : "#000",
              shadowOpacity:
                checkDeadlineRemainingTime(formatTimestamp(item.dueDate))
                  .isWithinTwoDays === 1 && !item.status
                  ? 1
                  : 0.1,
              shadowRadius:
                checkDeadlineRemainingTime(formatTimestamp(item.dueDate))
                  .isWithinTwoDays === 1 && !item.status
                  ? 9
                  : 4,
            },
          ]}
          onPress={() => {
            setHomeworkItem(item);
            setIsDetailedModalVisible(true);
          }}
          onLongPress={() =>
            item.status == true ? null : updateHomeworkStatus(item.id)
          }
        >
          <View
            style={[
              styles.deadlineTaskBox,
              {
                borderLeftColor: params?.color,
                backgroundColor: "#ffffff",
              },
            ]}
          >
            <View
              style={[
                styles.statusIconBox,
                {
                  backgroundColor: item.status
                    ? "#D2F8D2"
                    : checkDeadlineRemainingTime(formatTimestamp(item.dueDate))
                        .isWithinTwoDays == 0
                    ? "#FDDCDC"
                    : "#E4E4E7",
                },
              ]}
            >
              <Icon.FontAwesome
                name={
                  item.status
                    ? "check"
                    : checkDeadlineRemainingTime(formatTimestamp(item.dueDate))
                        .isWithinTwoDays == 0
                    ? "times"
                    : "dot-circle-o"
                }
                size={28}
                color={
                  item.status
                    ? "#3FCF63"
                    : checkDeadlineRemainingTime(formatTimestamp(item.dueDate))
                        .isWithinTwoDays == 0
                    ? "#F44336"
                    : "#A0A0A5"
                }
              />
            </View>
            <View style={styles.deadlineDetails}>
              <Text
                style={styles.subjectText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}:
              </Text>
              <Text
                style={styles.taskText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
              <Text
                style={[
                  styles.dueDateText,
                  {
                    color: 2 === 1 ? "#e02225" : "grey",
                  },
                ]}
              >
                <Text style={styles.dueDateDescriptionText}>Abgabedatum: </Text>
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
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const filteredHomeworkList =
    selectedOption == "offen"
      ? homeworkList.filter((item) => item.status == false)
      : selectedOption == "erledigt"
      ? homeworkList.filter((item) => item.status == true)
      : homeworkList;

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight + 6 }]}>
      <View style={styles.segmentedControlBox}>
        <SegmentedControl
          options={["Alle", "offen", "erledigt"]}
          selectedOption={selectedOption}
          onOptionPress={setSelectedOption}
        />
      </View>
      <FlatList
        data={filteredHomeworkList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" color="#333" />
          ) : filteredHomeworkList.length < 1 ? (
            <Text style={styles.emptyListText}>
              {selectedOption == "erledigt"
                ? "Keine erledigten Hausaufgaben"
                : "Alle Aufgaben erledigt!"}
            </Text>
          ) : null
        }
        style={{ padding: 8 }}
      />
      <InputModal
        visible={isInputModalVisible}
        onClose={() => setIsInputModalVisible(false)}
        addHomework={addHomework}
        addDeadline={addDeadline}
        subject={params.subject}
        color={params?.color}
      />
      <HomeworkModal
        visible={isDetailedModalVisible}
        onClose={() => setIsDetailedModalVisible(false)}
        item={homeworkItem}
        color={params?.color}
        onDelete={deleteHomework}
        onUpdate={updateHomework}
        changeStatus={updateHomeworkStatus}
      />
    </View>
  );
};

export default GenericScreen;

const InputModal = ({ visible, onClose, addHomework, color }) => {
  const [multiInputFocused, setMultiInputFocused] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDeadline, setIsDeadline] = useState(false);
  const titleInputRef = useRef(null);

  const hexToHsla = (hex, alpha = 0.15) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    //RGB in HSL Umwandlung
    (r /= 255), (g /= 255), (b /= 255);
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; //Graustufen
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }

    l = Math.min(0.92, l + 0.25);

    return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%, ${alpha})`;
  };

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
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Animated.View style={[styles.modalContent, animatedModalStyle]}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor:
                      color === "#333" ? "#F0F0F0" : hexToHsla(color),
                  },
                ]}
              >
                <TextInput
                  ref={titleInputRef}
                  autoFocus
                  style={[styles.deadlineModalTitle, { color: color }]}
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

                <Text style={[styles.motivationText, { fontWeight: "700" }]}>
                  Abgabedatum:{" "}
                </Text>
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "default" : "spinner"}
                    minimumDate={startDate}
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
                    addHomework(
                      title || "Unbenannt",
                      startDate,
                      dueDate,
                      description || "-",
                      isDeadline
                    );
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

  return (
    <View style={styles.containerInput}>
      <Text style={styles.charCount}>{text.length} / 200</Text>

      <TextInput
        style={styles.input}
        placeholder="Gib deinen Text ein..."
        placeholderTextColor="gray"
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
    fontSize: RFPercentage(2.44),
    color: "#333",
  },
  remainingTimeText: {
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
    color: "#d13030",
  },
  motivationText: {
    fontSize: RFPercentage(1.67),
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
  },
  finishButtonView: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  finishButton: {
    width: 120,
    height: 40,
    backgroundColor: "#0066cc",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  finishButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFPercentage(2.05),
  },
  homeworkItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  emptyListText: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    marginRight: 15,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 12,
    fontSize: RFPercentage(2.18),
    textAlignVertical: "top",
    maxHeight: 140,
  },
  charCount: {
    textAlign: "right",
    fontSize: RFPercentage(1.92),
    color: "#666",
    margin: 2,
  },
  deadlineResult: {
    width: "auto",
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
    backgroundColor: "#E4E4E7",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
  },
  deadlineDetails: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginLeft: 15,
  },
  subjectText: {
    color: "#333",
    fontSize: RFPercentage(2.18),
    fontWeight: "700",
    marginBottom: 10,
  },
  taskText: {
    fontSize: RFPercentage(1.92),
    color: "#666",
    marginBottom: 16,
  },
  dueDateText: {
    fontSize: RFPercentage(2.05),
    fontWeight: "700",
    color: "grey",
  },
  dueDateDescriptionText: {
    color: "#333",
    fontSize: RFPercentage(1.92),
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
    fontSize: RFPercentage(2.05),
    fontWeight: "500",
    color: "#333",
  },
  segmentedControlBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statusIconBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 42,
    height: 42,
  },
});
