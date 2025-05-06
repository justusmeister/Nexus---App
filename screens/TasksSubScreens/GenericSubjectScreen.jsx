import { useLayoutEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  setDoc,
  getDocs,
  addDoc,
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
import { checkDeadlineRemainingTime } from "../../utils/checkDeadlineRemainingTime";
import HomeworkBottomSheet from "../../components/BottomSheets/HomeworkBottomSheet/HomeworkBottomSheet";
import HomeworkModal from "../../modals/HomeworkModal";
import { SegmentedControl } from "../../components/SegmentedControl";
import GenericSubjectItem from "../../components/GenericSubject/GenericSubjectItem";

const GenericScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const [isDetailedModalVisible, setIsDetailedModalVisible] = useState(false);
  const [homeworkItem, setHomeworkItem] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const buttonScale = useState(new Animated.Value(1))[0];

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  const [selectedOption, setSelectedOption] = useState("Alle");

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params.subject,
      headerRight: () => (
        <TouchableOpacity style={styles.addButton} onPress={handleOpen}>
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
          priority: doc.data().priority || 0,
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
    isDeadline,
    priority
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
          priority: priority,
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

  const handleOpenDetailedModal = (item) => {
    setHomeworkItem(item);
    setIsDetailedModalVisible(true);
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
        renderItem={({ item, index }) => (
          <GenericSubjectItem
            item={item}
            index={index}
            color={params?.color}
            handleOpenDetailedModal={handleOpenDetailedModal}
            updateHomeworkStatus={updateHomeworkStatus}
            activeAnimation={activeAnimation}
            setActiveAnimation={setActiveAnimation}
            buttonScale={buttonScale}
          />
        )}
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
      <HomeworkBottomSheet
        sheetRef={sheetRef}
        titleInputRef={titleInputRef}
        addHomework={addHomework}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
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
});
