import { useRef, useCallback, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import HomeHeader from "../../components/Home/HomeHeader";
import MessageBox from "../../components/MessageBox";
import Checkbox from "../../components/Checkbox";
import { useEmailData } from "../../contexts/EmailContext";
import { useDeadlinesData } from "../../contexts/DeadlinesContext";
import { extractName, truncateText } from "../../utils/emailUtils";
import { formatDate } from "../../utils/dateUtils";
import { RFPercentage } from "react-native-responsive-fontsize";
import { checkDeadlineRemainingTime } from "../../utils/checkDeadlineRemainingTime";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Icon from "@expo/vector-icons";
import { trigger } from "react-native-haptic-feedback";
import { formatDueDateFromTimestamp } from "../../utils/formatDueDate";
import DeadlineBottomSheet from "../../components/BottomSheets/DeadlineBottomSheet/DeadlineBottomSheet";
import { useAppointments } from "../../hooks/useAppointments";
import { getAuth } from "firebase/auth";
import SubjectSelectionModal from "../../modals/SubjectSelectionModal";
import { useTodos } from "../../hooks/useTodos";
import TodoBottomSheet from "../../components/BottomSheets/TodoBottomSheet/TodoBottomSheet";
import HomeworkBottomSheet from "../../components/BottomSheets/HomeworkBottomSheet/HomeworkBottomSheet";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { firestoreDB } from "../../firebaseConfig";
import { eventEmitter } from "../../eventBus";
import { useTheme } from "@react-navigation/native";
import FadeInTab from "../../components/General/FadeInTab";

const HomeScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const { deadlinesData, deleteDeadline } = useDeadlinesData();
  const { mailData, refreshing } = useEmailData();
  const { colors } = useTheme();

  const [selectedSubject, setSelectedSubject] = useState("");

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const sheetRefTodo = useRef(null);
  const titleInputRefTodo = useRef(null);

  const sheetRefHomework = useRef(null);
  const titleInputRefHomework = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const { addAppointment } = useAppointments(user);
  const { addTodo } = useTodos(user);

  const [subjectSelectionModalVisible, setSubjectSelectionModalVisible] =
    useState(false);

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  const handleOpenTodo = () => {
    sheetRefTodo.current?.present();
    setTimeout(() => {
      titleInputRefTodo.current?.focus();
    }, 200);
  };

  const handleOpenHomework = () => {
    sheetRefHomework.current?.present();
    setTimeout(() => {
      titleInputRefHomework.current?.focus();
    }, 200);
  };

  const handleAddAppointment = useCallback(
    (
      name,
      day,
      endDate,
      eventType,
      description,
      singleEvent,
      saveAsDeadline
    ) => {
      addAppointment(
        name,
        day,
        endDate,
        eventType,
        description,
        singleEvent,
        saveAsDeadline
      );
    },
    [addAppointment]
  );

  const handleAddHomework = useCallback(
    async (title, dueDate, description, isDeadline, priority) => {
      if (user) {
        try {
          const subjectRef = doc(
            firestoreDB,
            "subjects",
            user.uid + selectedSubject
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
          isDeadline ? addDeadline(title, dueDate, description) : null;
        }
      }
    }
  );

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

  const { showActionSheetWithOptions } = useActionSheet();

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const handlePressedFocusButton = () => {
    trigger("impactLight", options);
    navigation.navigate("Focus");
  };

  const handlePressedHeaderButton = () => {
    trigger("impactLight", options);
    handleOpenSheet();
  };

  const handlePressedTodayViewButton = () => {
    trigger("impactLight", options);
    navigation.navigate("DayOverview");
  };

  const handleOpenSheet = () => {
    const options = [
      "Hausaufgabe",
      "Termin / Frist",
      "Todo",
      "Notiz",
      "Abbrechen",
    ];
    const cancelButtonIndex = 4;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Neu erstellen",
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            setSubjectSelectionModalVisible(true);
            break;
          case 1:
            handleOpen();
            break;
          case 2:
            handleOpenTodo();
            break;
          case 3:
            navigation.navigate("NotesInputScreen", {
              fastNotes: true,
            });
            break;
          default:
            break;
        }
      }
    );
  };

  const noEntryTemplate = (text) => {
    return (
      <Text
        style={{
          color: "white",
          fontSize: RFPercentage(1.92),
          fontWeight: "500",
        }}
      >
        {text}
      </Text>
    );
  };

  const inboxTemplate = (writer, reference, date, read, index) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("InboxScreen", { emailId: index })}
      style={{ justifyContent: "center" }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: RFPercentage(1.79),
            fontWeight: read ? "500" : "700",
          }}
        >
          {truncateText(extractName(writer), 15)}
        </Text>
        <Text
          style={{
            fontSize: RFPercentage(1.67),
            fontWeight: "500",
            color: "#363636",
            alignSelf: "flex-start",
          }}
        >
          {formatDate(date)}
        </Text>
      </View>
      <Text
        style={{ color: "white", fontSize: RFPercentage(1.79) }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {reference}
      </Text>
    </TouchableOpacity>
  );

  const deadlineTemplate = (subject, task, date, place) => {
    function parseToTimestamp(dateString) {
      const [day, month, year] = dateString.split(".");
      const fullYear = parseInt(year) < 50 ? "20" + year : "19" + year;
      const date = new Date(`${fullYear}-${month}-${day}`);
      const seconds = Math.floor(date.getTime() / 1000);
      return { seconds };
    }

    const formattedDueDate = formatDueDateFromTimestamp(parseToTimestamp(date));
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
          opacity:
            checkDeadlineRemainingTime(date).isWithinTwoDays === 0 ||
            checkDeadlineRemainingTime(date).isWithinTwoDays === -1
              ? 0.4
              : 1,
        }}
        onPress={() => navigation.navigate("DeadlineScreen", { taskId: place })}
      >
        <Checkbox onConfirm={() => deleteDeadline(deadlinesData[place].id)} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>
            <Text
              style={{
                color: "white",
                fontSize: RFPercentage(2.05),
                fontWeight: "600",
              }}
            >
              {truncateText(subject, 7)}:
            </Text>
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: RFPercentage(1.92),
              fontWeight: "500",
              paddingHorizontal: 5,
              flexShrink: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task}
          </Text>
          <Text
            style={{
              fontSize: RFPercentage(1.67),
              fontWeight: "700",
              color: "#363636",
            }}
          >
            {formattedDueDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FadeInTab>
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        style={[styles.container, { marginBottom: tabBarHeight + 12 }]}
      >
        <View style={styles.view}>
          <HomeHeader
            onLeftPress={handlePressedTodayViewButton}
            onMiddlePress={handlePressedFocusButton}
            onRightPress={handlePressedHeaderButton}
          />
          {/*<MessageBox
            title="Neuigkeiten"
            style={{
              height: "32%",
              backgroundColor: "#0d7a18",
              borderRadius: 20,
            }}
            icon="message-square"
            titleStyle={{
              borderBottomWidth: newsBoxDummyData.length > 0 ? 0 : 1,
              borderBottomColor: "#b3b3ba",
            }}
            content={[
              {
                content:
                  newsBoxDummyData.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("NewsScreen")}
                    >
                      <Text
                        style={{ color: "white", fontSize: RFPercentage(2.05) }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {newsBoxDummyData[0].news}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    noEntryTemplate("aktuell keine Neuigkeiten")
                  ),
                style: [
                  styles.iservContent,
                  { borderWidth: newsBoxDummyData.length > 0 ? 0.5 : 0 },
                ],
              },
              {
                content:
                  newsBoxDummyData.length > 1 ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("NewsScreen")}
                    >
                      <Text
                        style={{ color: "white", fontSize: RFPercentage(2.05) }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {newsBoxDummyData[1].news}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    noEntryTemplate("keine weiteren Neuigkeiten")
                  ),
                style: [
                  styles.iservContent,
                  { borderWidth: newsBoxDummyData.length > 1 ? 0.5 : 0 },
                ],
              },
              {
                content:
                  newsBoxDummyData.length > 2 ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("NewsScreen")}
                    >
                      <Text
                        style={{ color: "white", fontSize: RFPercentage(2.05) }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {newsBoxDummyData[2].news}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    noEntryTemplate("keine weiteren Neuigkeiten")
                  ),
                style: [
                  styles.iservContent,
                  { borderWidth: newsBoxDummyData.length > 2 ? 0.5 : 0 },
                ],
              },
            ]}
            onPress={() => navigation.navigate("NewsScreen")}
          />*/}
          <Pressable
            onPress={() => navigation.navigate("NewsScreen")}
            style={({ pressed }) => [
              styles.newsBox,
              { opacity: pressed ? 0.4 : 1 },
            ]}
          >
            <View style={styles.titleBox}>
              <View style={styles.title}>
                <Icon.Feather
                  name="message-square"
                  size={22}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: "white",
                    fontSize: RFPercentage(2.54),
                    fontFamily: "Inter_600SemiBold",
                    marginBottom: 5,
                    paddingTop: 3,
                  }}
                >
                  Neuigkeiten
                </Text>
              </View>
              <Icon.Feather
                name="chevron-right"
                size={20}
                color="white"
                style={{ alignSelf: "center" }}
              />
            </View>
          </Pressable>
          <MessageBox
            title="E-Mail Postfach"
            style={{
              height: "32%",
              backgroundColor: "#3872cf",
              borderRadius: 25,
            }}
            icon="inbox"
            titleStyle={{
              borderBottomWidth:
                mailData?.length > 0 && mailData[0] !== "loading" ? 0 : 1,
              borderBottomColor: "#b3b3ba",
            }}
            isLoading={mailData[0] ? mailData[0] === "loading" : true}
            isRefreshing={refreshing}
            content={[
              {
                content:
                  mailData.length > 0 && mailData[0] !== "loading"
                    ? inboxTemplate(
                        mailData[0].from,
                        mailData[0].subject,
                        mailData[0].date,
                        mailData[0].read,
                        0
                      )
                    : noEntryTemplate("keine weiteren Einträge"),
                style: [
                  styles.iservContent,
                  { borderWidth: mailData.length > 0 ? 0.5 : 0 },
                ],
              },
              {
                content:
                  mailData.length > 1
                    ? inboxTemplate(
                        mailData[1].from,
                        mailData[1].subject,
                        mailData[1].date,
                        mailData[1].read,
                        1
                      )
                    : mailData.length > 0
                    ? noEntryTemplate("alle Aufgaben erledigt")
                    : null,

                style: [
                  styles.iservContent,
                  { borderWidth: mailData.length > 1 ? 0.5 : 0 },
                ],
              },
              {
                content:
                  mailData.length > 2
                    ? inboxTemplate(
                        mailData[2].from,
                        mailData[2].subject,
                        mailData[2].date,
                        mailData[2].read,
                        2
                      )
                    : mailData.length > 1
                    ? noEntryTemplate("alle Aufgaben erledigt")
                    : null,
                style: [
                  styles.iservContent,
                  { borderWidth: mailData.length > 2 ? 0.5 : 0 },
                ],
              },
            ]}
            onPress={() => navigation.navigate("InboxScreen")}
          />
          <MessageBox
            title="Termine & Fristen"
            style={{
              height: "32%",
              backgroundColor: "#e74c3c",
              borderRadius: 25,
            }}
            icon="flag"
            titleStyle={{
              borderBottomWidth:
                deadlinesData.length > 0 && deadlinesData[0] !== "loading"
                  ? 0
                  : 1,
              borderBottomColor: "#b3b3ba",
            }}
            isLoading={deadlinesData[0] === "loading"}
            content={[
              {
                content:
                  deadlinesData.length > 0 && deadlinesData[0] !== "loading"
                    ? deadlineTemplate(
                        deadlinesData[0].subject,
                        deadlinesData[0].task,
                        deadlinesData[0].dueDate,
                        0
                      )
                    : noEntryTemplate("Alle Termine erledigt! 💪"),
                style: [
                  styles.iservContent,
                  {
                    borderWidth:
                      deadlinesData.length > 0 && deadlinesData[0] !== "loading"
                        ? checkDeadlineRemainingTime(deadlinesData[0].dueDate)
                            .isWithinTwoDays === 1
                          ? 2.5
                          : 0.5
                        : 0,
                    borderColor:
                      deadlinesData.length > 0 && deadlinesData[0] !== "loading"
                        ? checkDeadlineRemainingTime(deadlinesData[0].dueDate)
                            .isWithinTwoDays === 1
                          ? "#750101"
                          : "#b3b3ba"
                        : "#b3b3ba",
                  },
                ],
              },
              {
                content:
                  deadlinesData.length > 1
                    ? deadlineTemplate(
                        deadlinesData[1].subject,
                        deadlinesData[1].task,
                        deadlinesData[1].dueDate,
                        1
                      )
                    : deadlinesData.length > 0
                    ? noEntryTemplate("Keine weiteren Termine mehr")
                    : null,
                style: [
                  styles.iservContent,
                  {
                    borderWidth:
                      deadlinesData.length > 1
                        ? checkDeadlineRemainingTime(deadlinesData[1].dueDate)
                            .isWithinTwoDays === 1
                          ? 2.5
                          : 0.5
                        : 0,
                    borderColor:
                      deadlinesData.length > 1
                        ? checkDeadlineRemainingTime(deadlinesData[1].dueDate)
                            .isWithinTwoDays === 1
                          ? "#750101"
                          : "#b3b3ba"
                        : "#b3b3ba",
                  },
                ],
              },
              {
                content:
                  deadlinesData.length > 2
                    ? deadlineTemplate(
                        deadlinesData[2].subject,
                        deadlinesData[2].task,
                        deadlinesData[2].dueDate,
                        2
                      )
                    : deadlinesData.length > 1
                    ? noEntryTemplate("Keine weiteren Termine mehr")
                    : null,
                style: [
                  styles.iservContent,
                  {
                    borderWidth:
                      deadlinesData.length > 2
                        ? checkDeadlineRemainingTime(deadlinesData[2].dueDate)
                            .isWithinTwoDays === 1
                          ? 2.5
                          : 0.5
                        : 0,
                    borderColor:
                      deadlinesData.length > 2
                        ? checkDeadlineRemainingTime(deadlinesData[2].dueDate)
                            .isWithinTwoDays === 1
                          ? "#750101"
                          : "#b3b3ba"
                        : "#b3b3ba",
                  },
                ],
              },
            ]}
            onPress={() => navigation.navigate("DeadlineScreen")}
          />
        </View>
        <DeadlineBottomSheet
          sheetRef={sheetRef}
          titleInputRef={titleInputRef}
          addAppointment={handleAddAppointment}
        />
        <TodoBottomSheet
          sheetRef={sheetRefTodo}
          titleInputRef={titleInputRefTodo}
          addTodo={addTodo}
        />
        <HomeworkBottomSheet
          sheetRef={sheetRefHomework}
          titleInputRef={titleInputRefHomework}
          selectedSubject={selectedSubject}
          addHomework={handleAddHomework}
        />
        <SubjectSelectionModal
          visible={subjectSelectionModalVisible}
          onClose={() => setSubjectSelectionModalVisible(false)}
          openHomeworkSheet={handleOpenHomework}
          setSelectedSubject={setSelectedSubject}
        />
      </SafeAreaView>
    </View>
    </FadeInTab>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
  },
  view: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iservContent: {
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  titleBox: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newsBox: {
    height: "10%",
    backgroundColor: "#27853b",
    borderRadius: 25,
    width: "100%",
    shadowColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
