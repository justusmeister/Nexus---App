import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
  Pressable,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import MessageBox from "../components/MessageBox";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import Checkbox from "../components/Checkbox";
import InboxDetailedScreen from "./HomeDetailedScreens/InboxDetailedScreen";
import NewsDetailedScreen from "./HomeDetailedScreens/NewsDetailedScreen";
import { useRoute } from "@react-navigation/native";
import { checkDeadlineRemainingTime } from "../externMethods/checkDeadlineRemainingTime";

const DeadlinesContext = createContext();

const Stack = createNativeStackNavigator();

const newsBoxDummyData = [
  {
    news: "Es fällt die 5. Stunde aus!",
  },
  {
    news: "Neues Update verfügbar !",
  },
  {
    news: "Die alten Bugs wurden gestern gefixed !",
  },
];

export const iServInboxDummyData = [
  {
    author: "Herr Müller-Schmidt",
    title: "Ankündigung für die Klassenarbeit",
    date: new Date("2024-11-21T15:00:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
  {
    author: "Lisa Müller",
    title: "Neue Hausaufgabe für Montag",
    date: new Date("2024-11-12T12:00:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: true,
  },
  {
    author: "Herr Schmidt",
    title: "Wichtige Info zur Exkursion",
    date: new Date("2024-11-21T15:00:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
  {
    author: "Frau Meier",
    title: "Korrektur der letzten Klausur",
    date: new Date("2024-11-18T12:45:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: true,
  },
  {
    author: "Max Mustermann",
    title: "Elternabend am nächsten Donnerstag",
    date: new Date("2024-11-22T18:00:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
  {
    author: "Herr Weber",
    title: "Material für das nächste Projekt",
    date: new Date("2024-11-21T09:00:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: true,
  },
  {
    author: "Frau Schulz",
    title: "Vertretung in der 3. Stunde",
    date: new Date("2024-11-23T07:45:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
  {
    author: "Lisa Müller",
    title: "Info zu den Winterferien",
    date: new Date("2024-11-24T13:30:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
  {
    author: "Herr Schmidt",
    title: "Abgabe der Facharbeit",
    date: new Date("2024-11-20T14:15:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: true,
  },
  {
    author: "Frau Meier",
    title: "Rückgabe der Seminararbeit",
    date: new Date("2024-11-25T11:00:00").toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
];

const deadlinesDummyData = [
  { subject: "Informatik", task: "B. S. 72 Nr. 5", dueDate: "25.12.24" },
  { subject: "Sport", task: "5 Runden laufen", dueDate: "03.06.25" },
];

const HomeStack = function ({ navigation }) {
  const [deadlinesData, setDeadlinesData] = useState(deadlinesDummyData);

  const changeData = (newData) => {
    setDeadlinesData(newData);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("HomeScreen");
    });

    return unsubscribe;
  }, []);

  return (
    <DeadlinesContext.Provider value={{ deadlinesData, changeData }}>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: "Startseite",
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "#EFEEF6" },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsScreen")}
              >
                <Icon.Ionicons name="settings" size={31} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="NewsScreen"
          component={NewsScreen}
          options={{
            title: "Neuigkeiten",
            headerBackTitle: "Zurück",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="InboxScreen"
          component={InboxScreen}
          options={{
            title: "Posteingang",
            headerBackTitle: "Zurück",
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="DeadlineScreen"
          component={DeadlineScreen}
          options={{
            title: "anstehende Fristen",
            headerBackTitle: "Zurück",
            headerTintColor: "black",
          }}
        />
      </Stack.Navigator>
    </DeadlinesContext.Provider>
  );
};

export const useDeadlinesData = () => useContext(DeadlinesContext);

export default HomeStack;

const NewsScreen = function ({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6", paddingBottom: 80 }}>
      <NewsDetailedScreen data={newsBoxDummyData} />
    </View>
  );
};

const InboxScreen = function ({ navigation }) {
  const route = useRoute();

  let index = route.params?.emailId !== null ? route.params?.emailId : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6", paddingBottom: 80 }}>
      <InboxDetailedScreen data={iServInboxDummyData} index={index} />
    </View>
  );
};

const DeadlineInformationModal = ({ visible, task, onClose }) => {
  const dueDate = task !== null ? task.dueDate : "01.01.2000";

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text>{checkDeadlineRemainingTime(dueDate).time}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const DeadlineDetailedScreen = function () {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { deadlinesData, changeData } = useDeadlinesData();
  const [activeAnimation, setActiveAnimation] = useState(null);
  const scale = useState(new Animated.Value(1))[0];

  const route = useRoute();

  let index = route.params?.taskId !== null ? route.params?.taskId : null;

  useEffect(() => {
    if (index !== null && index !== undefined) {
      const task = deadlinesData[index];
      setTimeout(() => {
        setCurrentTask(task);
        setIsModalVisible(true);
      }, 300);
    } else {
      console.log("Kein Index vorhanden");
    }
  }, [index]);

  const renderDeadline = ({ item, index }) => {
    const handlePressIn = () => {
      setActiveAnimation(index);
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
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
          styles.deadlineResult,
          { transform: [{ scale: activeAnimation === index ? scale : 1 }] },
          {
            shadowColor:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 1
                ? "#e02225"
                : "black",
            shadowOpacity:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 1
                ? 1
                : 0.3,
            shadowRadius:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 1
                ? 9
                : 4,
          },
        ]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            setCurrentTask(deadlinesData[index]);
            setIsModalVisible(true);
          }}
          style={styles.deadlineTaskBox}
        >
          <View style={styles.deadlineDetails}>
            <Text style={styles.subjectText}>{item.subject}:</Text>
            <Text style={styles.taskText}>{item.task}</Text>
            <Text
              style={[
                styles.dueDateText,
                {
                  color:
                    checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                      .isWithinTwoDays === 1
                      ? "#e02225"
                      : "grey",
                },
              ]}
            >
              <Text style={styles.dueDateDescriptionText}>Frist endet am:</Text>{" "}
              {item.dueDate}
            </Text>
          </View>
          <Checkbox
            onConfirm={() => {
              const updatedDeadlines = deadlinesData.filter(
                (_, objIndex) => objIndex !== index
              );
              changeData(updatedDeadlines);
            }}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={deadlinesData}
        renderItem={renderDeadline}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 8 }}
      />
      <DeadlineInformationModal
        visible={isModalVisible}
        task={currentTask}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export const DeadlineScreen = function ({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6", paddingBottom: 79 }}>
      <DeadlineDetailedScreen />
    </View>
  );
};

export const HomeScreen = function ({ navigation }) {
  const { deadlinesData, changeData } = useContext(DeadlinesContext);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..";
    }
    return text;
  };

  const noEntryTemplate = (text) => {
    return (
      <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
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
            fontSize: 13,
            fontWeight: read ? "500" : "700",
          }}
        >
          {writer}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: "#363636",
            alignSelf: "flex-start",
          }}
        >
          {date}
        </Text>
      </View>
      <Text style={{ color: "white", fontSize: 13 }}>{reference}</Text>
    </TouchableOpacity>
  );

  const deadlineTemplate = (subject, task, date, place) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={() => navigation.navigate("DeadlineScreen", { taskId: place })}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
          {subject}:
        </Text>

        <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
          {task}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#363636",
          }}
        >
          {date}
        </Text>
      </View>
      <Checkbox
        onConfirm={() => {
          if (deadlinesData.length > 1) {
            const updatedDeadlines = deadlinesData.filter(
              (_, index) => index !== place
            );
            changeData(updatedDeadlines);
          } else {
            changeData([]);
          }
        }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.view} contentInsetAdjustmentBehavior="automatic">
          <MessageBox
            title="Neuigkeiten"
            style={{
              backgroundColor: "#0d7a18",
              borderRadius: 20,
            }}
            icon="newspaper-o"
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
                      <Text style={{ color: "white", fontSize: 15 }}>
                        {truncateText(newsBoxDummyData[0].news, 21)}
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
                      <Text style={{ color: "white", fontSize: 15 }}>
                        {truncateText(newsBoxDummyData[1].news, 21)}
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
                      <Text style={{ color: "white", fontSize: 15 }}>
                        {truncateText(newsBoxDummyData[2].news, 21)}
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
          />
          <MessageBox
            title="iServ Postfach"
            style={{
              backgroundColor: "#2165bf",
              borderRadius: 20,
            }}
            icon="inbox"
            titleStyle={{
              borderBottomWidth: iServInboxDummyData.length > 0 ? 0 : 1,
              borderBottomColor: "#b3b3ba",
            }}
            content={[
              {
                content:
                  iServInboxDummyData.length > 0
                    ? inboxTemplate(
                        truncateText(iServInboxDummyData[0].author, 16),
                        truncateText(iServInboxDummyData[0].title, 24),
                        iServInboxDummyData[0].date,
                        iServInboxDummyData[0].read,
                        0
                      )
                    : noEntryTemplate("keine weiteren Einträge"),
                style: [
                  styles.iservContent,
                  { borderWidth: iServInboxDummyData.length > 0 ? 0.5 : 0 },
                ],
              },
              {
                content:
                  iServInboxDummyData.length > 1
                    ? inboxTemplate(
                        truncateText(iServInboxDummyData[1].author, 16),
                        truncateText(iServInboxDummyData[1].title, 24),
                        iServInboxDummyData[1].date,
                        iServInboxDummyData[1].read,
                        1
                      )
                    : iServInboxDummyData.length > 0
                    ? noEntryTemplate("alle Aufgaben erledigt")
                    : null,

                style: [
                  styles.iservContent,
                  { borderWidth: iServInboxDummyData.length > 1 ? 0.5 : 0 },
                ],
              },
              {
                content:
                  iServInboxDummyData.length > 2
                    ? inboxTemplate(
                        truncateText(iServInboxDummyData[2].author, 16),
                        truncateText(iServInboxDummyData[2].title, 24),
                        iServInboxDummyData[2].date,
                        iServInboxDummyData[2].read,
                        2
                      )
                    : iServInboxDummyData.length > 1
                    ? noEntryTemplate("alle Aufgaben erledigt")
                    : null,
                style: [
                  styles.iservContent,
                  { borderWidth: iServInboxDummyData.length > 2 ? 0.5 : 0 },
                ],
              },
            ]}
            onPress={() => navigation.navigate("InboxScreen")}
          />
          <MessageBox
            title="anstehende Fristen"
            style={{
              backgroundColor: "#e02225",
              borderRadius: 20,
            }}
            icon="hourglass-1"
            titleStyle={{
              borderBottomWidth: deadlinesData.length > 0 ? 0 : 1,
              borderBottomColor: "#b3b3ba",
            }}
            content={[
              {
                content:
                  deadlinesData.length > 0
                    ? deadlineTemplate(
                        truncateText(deadlinesData[0].subject, 6),
                        truncateText(deadlinesData[0].task, 10),
                        deadlinesData[0].dueDate,
                        0
                      )
                    : noEntryTemplate("alle Aufgaben erledigt"),
                style: [
                  styles.iservContent,
                  {
                    borderWidth:
                      deadlinesData.length > 0
                        ? checkDeadlineRemainingTime(deadlinesData[0].dueDate)
                            .isWithinTwoDays === 1
                          ? 2.5
                          : 0.5
                        : 0,
                    borderColor:
                      deadlinesData.length > 0
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
                        truncateText(deadlinesData[1].subject, 6),
                        truncateText(deadlinesData[1].task, 10),
                        deadlinesData[1].dueDate,
                        1
                      )
                    : deadlinesData.length > 0
                    ? noEntryTemplate("alle restlichen Aufgaben erledigt")
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
                        truncateText(deadlinesData[2].subject, 6),
                        truncateText(deadlinesData[2].task, 10),
                        deadlinesData[2].dueDate,
                        2
                      )
                    : deadlinesData.length > 1
                    ? noEntryTemplate("alle restlichen Aufgaben erledigt")
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 89,
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
    padding: 10,
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
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
