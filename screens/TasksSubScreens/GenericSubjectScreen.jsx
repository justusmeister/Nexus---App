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
import { useRoute, useTheme } from "@react-navigation/native";
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
import GenericSubjectItem from "../../components/GenericSubject/GenericSubjectItem";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PlusButton from "../../components/General/PlusButton";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";

const GenericScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const [isDetailedModalVisible, setIsDetailedModalVisible] = useState(false);
  const [homeworkItem, setHomeworkItem] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const buttonScale = useState(new Animated.Value(1))[0];
  const { colors, fonts } = useTheme();

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  const segmentedValues = ["Alle", "offen", "erledigt"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedOption = segmentedValues[selectedIndex];

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params.subject,
      headerRight: () => <PlusButton onPress={handleOpen} small />,
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

  const updateHomework = async (title, description, dueDate, id) => {
    if (user) {
      setHomeworkList((prev) =>
        prev.map((hw) =>
          hw.id === id
            ? {
                ...hw,
                title: title,
                description: description,
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

  const updateHomeworkStatus = async (id, status = true) => {
    if (user) {
      setHomeworkList((prev) =>
        prev.map((hw) => (hw.id === id ? { ...hw, status: status } : hw))
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
            status: status,
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
    selectedOption === "offen"
      ? homeworkList.filter((item) => item.status === false)
      : selectedOption === "erledigt"
      ? homeworkList.filter((item) => item.status === true)
      : homeworkList;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, marginTop: 5, 
      borderTopColor: colors.border,
      borderTopWidth: StyleSheet.hairlineWidth }]}>
      <View style={styles.segmentedControlBox}>
        <SegmentedControl
          values={segmentedValues}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          style={{ height: 32, width: "100%" }}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <Reanimated.View
          key={selectedIndex}
          entering={FadeIn}
          exiting={FadeOut}
        >
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
              filteredHomeworkList.length < 1 ? (
                <Text style={styles.emptyListText}>
                  {selectedOption === "erledigt"
                    ? "Keine erledigten Hausaufgaben"
                    : "Alle Aufgaben erledigt!"}
                </Text>
              ) : null
            }
            style={{ padding: 8 }}
            contentContainerStyle={{
              paddingBottom: tabBarHeight + 6, 
            }}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={10}
            maxToRenderPerBatch={10}
          />
        </Reanimated.View>
      )}

      <HomeworkBottomSheet
        sheetRef={sheetRef}
        titleInputRef={titleInputRef}
        addHomework={addHomework}
        selectedSubject={params?.subject || ""}
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
  },
  emptyListText: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
  segmentedControlBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingVertical: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});
