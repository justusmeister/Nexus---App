import React, { useEffect, useState, createContext, useContext } from "react";
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
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import MessageBox from "../components/MessageBox";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import Checkbox from "../components/Checkbox";
import InboxDetailedScreen from "./HomeSubScreens/InboxDetailedScreen";
import NewsDetailedScreen from "./HomeSubScreens/NewsDetailedScreen";
import { useRoute } from "@react-navigation/native";
import { checkDeadlineRemainingTime } from "../utils/checkDeadlineRemainingTime";
import { firestoreDB } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { eventEmitter } from "../eventBus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEmailData } from "../contexts/EmailContext";

const DeadlinesContext = createContext();

const Stack = createNativeStackNavigator();

const newsBoxDummyData = [
  {
    news: "Version 1.0 ist ab jetzt draußen!",
  },
  {
    news: "Entdecke die App!",
  },
];

const saveEmailsToStorage = async (emails) => {
  try {
    await AsyncStorage.setItem("emails", JSON.stringify(emails));
  } catch (error) {
    console.error("❌ Fehler beim Speichern der E-Mails:", error);
  }
};

const fetchEmails = async (setEmails) => {
  try {
    console.log("📨 Starte Anfrage an Server...");

    const response = await fetch(
      "https://iserv-email-retriever.onrender.com/fetch-emails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "justus.meister",
          password: "nivsic-wuGnej-9kyvke",
        }),
      }
    );

    console.log("📨 Antwort erhalten:", response.status);

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    console.log("📩 E-Mails erhalten:", JSON.stringify(data, null, 2));

    const sortedEmails = data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setEmails(sortedEmails);
    await saveEmailsToStorage(sortedEmails);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der E-Mails:", error);
  }
};

const HomeStack = function ({ navigation }) {
  const [deadlinesData, setDeadlinesData] = useState(["loading"]);

  const auth = getAuth();
  const user = auth.currentUser;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
  };

  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(2000 + year, month - 1, day, 7, 0, 0);
  };

  const deleteDeadline = async (deadlineId) => {
    const user = getAuth().currentUser;

    if (user) {
      try {
        const deadlineRef = doc(
          firestoreDB,
          "deadlines",
          user.uid,
          "deadlinesList",
          deadlineId
        );

        await deleteDoc(deadlineRef);

        changeData((prevDeadlines) =>
          prevDeadlines.filter((item) => item.id !== deadlineId)
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: "Beim Löschen der Deadline ist ein Fehler aufgetreten.",
          visibilityTime: 4000,
        });
        console.error("Fehler beim Löschen der Deadline:", e);
      }
    }
  };

  const fetchDeadlines = async () => {
    if (!user) return;
    try {
      const deadlinesRef = collection(
        firestoreDB,
        "deadlines",
        user.uid,
        "deadlinesList"
      );
      const deadlinesSnapshot = await getDocs(deadlinesRef);

      const deadlines = deadlinesSnapshot.docs.map((doc) => ({
        id: doc.id,
        subject: doc.data().name,
        task: doc.data().description,
        dueDate: formatTimestamp(doc.data().day),
        canDelete:
          checkDeadlineRemainingTime(formatTimestamp(doc.data().day)).time ===
          "delete"
            ? true
            : false,
      }));

      const currentDate = new Date();

      const upcomingDues = deadlines
        .filter((d) => parseDateString(d.dueDate) >= currentDate)
        .sort(
          (a, b) => parseDateString(a.dueDate) - parseDateString(b.dueDate)
        );

      const pastDues = deadlines
        .filter((d) => parseDateString(d.dueDate) < currentDate)
        .sort(
          (a, b) => parseDateString(b.dueDate) - parseDateString(a.dueDate)
        );

      const sortedDeadlines = [...upcomingDues, ...pastDues];

      setDeadlinesData(sortedDeadlines);

      for (const deadline of deadlines) {
        if (deadline.canDelete) {
          await deleteDeadline(deadline.id);
        }
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Termine:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeData = (newData) => {
    setDeadlinesData(newData);
  };

  useEffect(() => {
    fetchDeadlines();

    eventEmitter.on("refreshDeadlines", fetchDeadlines);

    return () => {
      eventEmitter.off("refreshDeadlines", fetchDeadlines);
    };
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
              <Pressable
                onPress={() => navigation.navigate("SettingsScreen")}
                style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
                hitSlop={12}
              >
                <Icon.Feather name="settings" size={25 * 1.1} />
              </Pressable>
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
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#EFEEF6",
        paddingBottom: tabBarHeight + 6,
      }}
    >
      <NewsDetailedScreen data={newsBoxDummyData} />
    </View>
  );
};

const InboxScreen = function ({ navigation }) {
  const route = useRoute();
  const { mailData } = useEmailData();

  let index = route.params?.emailId !== null ? route.params?.emailId : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <InboxDetailedScreen
        data={mailData}
        index={index}
        navigation={navigation}
      />
    </View>
  );
};

const DeadlineInformationModal = ({ visible, task, onClose, onConfirm }) => {
  const dueDate = task !== null ? task.dueDate : "01.01.2000";
  const taskText =
    task !== null ? task.task : "Aufgabe konnte nicht geladen werden";

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
                <Text style={styles.deadlineModalTitle}>
                  Verbleibende Zeit:
                </Text>
                <Text style={styles.remainingTimeText}>
                  {checkDeadlineRemainingTime(dueDate).time}
                </Text>
                <Text style={styles.motivationText}>
                  {checkDeadlineRemainingTime(dueDate).isWithinTwoDays === 1
                    ? "Du hast nicht mehr viel Zeit, bleib am Ball!"
                    : checkDeadlineRemainingTime(dueDate).isWithinTwoDays === 2
                    ? "Du schaffst das!"
                    : "Nächstes mal schaffst du es bestimmt!"}
                </Text>
              </View>
              <View style={styles.divider} />
              <ScrollView>
                <Pressable>
                  <Text style={styles.taskTextHeader}>Aufgabe:</Text>
                  <Text style={styles.taskText}>{taskText}</Text>
                </Pressable>
              </ScrollView>
              <View style={styles.finishButtonView}>
                <Pressable
                  style={styles.finishButton}
                  onPress={() => {
                    onClose();
                    Alert.alert(
                      "Frist abschließen?",
                      "Möchten Sie die Frist wirklich abschließen?",
                      [
                        {
                          text: "Abbrechen",
                        },
                        {
                          text: "Bestätigen",
                          onPress: () => {
                            onConfirm(task.id);
                          },
                          style: "destructive",
                        },
                      ]
                    );
                  }}
                >
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

const DeadlineDetailedScreen = function () {
  const tabBarHeight = useBottomTabBarHeight();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { deadlinesData, changeData } = useDeadlinesData();
  const [activeAnimation, setActiveAnimation] = useState(null);
  const scale = useState(new Animated.Value(1))[0];

  const route = useRoute();

  const deleteDeadline = async (deadlineId) => {
    const user = getAuth().currentUser;

    if (user) {
      try {
        const deadlineRef = doc(
          firestoreDB,
          "deadlines",
          user.uid,
          "deadlinesList",
          deadlineId
        );

        await deleteDoc(deadlineRef);

        changeData((prevDeadlines) =>
          prevDeadlines.filter((item) => item.id !== deadlineId)
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: "Beim Löschen der Deadline ist ein Fehler aufgetreten.",
          visibilityTime: 4000,
        });
        console.error("Fehler beim Löschen der Deadline:", e);
      }
    }
  };

  let index = route.params?.taskId !== null ? route.params?.taskId : null;

  useEffect(() => {
    if (index !== null && index !== undefined) {
      const task = deadlinesData[index];
      setTimeout(() => {
        setCurrentTask(task);
        setIsModalVisible(true);
      }, 300);
    }
  }, [index]);

  if (deadlinesData[0] === "loading") {
    return (
      <ScrollView contentContainerStyle={{ padding: 15, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#333" />
      </ScrollView>
    );
  }

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
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
            shadowColor:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 1
                ? "#e02225"
                : "#000",
            shadowOpacity:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 1
                ? 1
                : 0.1,
            shadowRadius:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 1
                ? 9
                : 4,
            opacity:
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === 0 ||
              checkDeadlineRemainingTime(deadlinesData[index].dueDate)
                .isWithinTwoDays === -1
                ? 0.5
                : 1,
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
          <Checkbox onConfirm={() => deleteDeadline(item.id)} />
          <View style={styles.deadlineDetails}>
            <Text style={styles.subjectText}>{item.subject}:</Text>
            <Text
              style={styles.taskText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.task}
            </Text>
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
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: tabBarHeight + 6 }}>
      <FlatList
        data={deadlinesData}
        renderItem={renderDeadline}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 8 }}
        ListEmptyComponent={
          <ScrollView
            contentContainerStyle={{ padding: 15, alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: RFPercentage(2.05),
                fontWeight: "500",
                color: "#8E8E93",
              }}
            >
              Alle Fristen erledigt! 💪
            </Text>
          </ScrollView>
        }
      />
      <DeadlineInformationModal
        visible={isModalVisible}
        task={currentTask}
        onClose={() => setIsModalVisible(false)}
        onConfirm={deleteDeadline}
      />
    </View>
  );
};

export const DeadlineScreen = function ({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <DeadlineDetailedScreen />
    </View>
  );
};

export const HomeScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const { deadlinesData, changeData } = useContext(DeadlinesContext);
  const { mailData, refreshing } = useEmailData();

  const truncateText = (text, maxLength) => {
    text = text || " ";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "…";
    }
    return text;
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }) +
      ", " +
      date.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  function extractName(from) {
    if (!from) return ""; // Falls from null, undefined oder leer ist, gib leeren String zurück
    const match = from.match(/"?(.*?)"?\s*<.*@.*>/);
    return match ? match[1] : from; // Falls Name existiert, bereinigt zurückgeben
  }

  const deleteDeadline = async (deadlineId) => {
    const user = getAuth().currentUser;

    if (user) {
      try {
        const deadlineRef = doc(
          firestoreDB,
          "deadlines",
          user.uid,
          "deadlinesList",
          deadlineId
        );

        await deleteDoc(deadlineRef);

        changeData((prevDeadlines) =>
          prevDeadlines.filter((item) => item.id !== deadlineId)
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: "Beim Löschen der Deadline ist ein Fehler aufgetreten.",
          visibilityTime: 4000,
        });
        console.error("Fehler beim Löschen der Deadline:", e);
      }
    }
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

  const deadlineTemplate = (subject, task, date, place) => (
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
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView
        style={[styles.container, { marginBottom: tabBarHeight + 6 }]}
      >
        <View style={styles.view}>
          <MessageBox
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
          />
          <MessageBox
            title="E-Mail Postfach"
            style={{
              height: "32%",
              backgroundColor: "#2165bf",
              borderRadius: 20,
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
            title="anstehende Termine"
            style={{
              height: "32%",
              backgroundColor: "#e02225",
              borderRadius: 20,
            }}
            icon="clock"
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
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#e02225",
  },
  deadlineDetails: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 15,
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
    flexShrink: 1,
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
  closeButtonText: {
    fontSize: RFPercentage(3.21),
    color: "#4A90E2",
  },
  modalHeader: {
    marginBottom: 10,
    backgroundColor: "#fceded",
    padding: 10,
    borderRadius: 8,
  },
  deadlineModalTitle: {
    fontWeight: "700",
    fontSize: RFPercentage(2.18),
    color: "#333",
  },
  remainingTimeText: {
    fontSize: RFPercentage(2.05),
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
  bodyContainer: {
    flex: 1,
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
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
  },
  finishButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFPercentage(1.92),
  },
  taskTextHeader: {
    fontSize: RFPercentage(2.31),
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
});
