import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MessageBox from "../components/MessageBox";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import Checkbox from "../components/Checkbox";

const Stack = createNativeStackNavigator();

const newsBoxDummyData = [];

const iServInboxDummyData = [
  {
    author: "Max Mustermann",
    title: "Ankündigung für die Klassenarbeit",
    date: "21.11.24 15:00",
    read: false,
  },
  {
    author: "Lisa Müller",
    title: "Neue Hausaufgabe für Montag",
    date: "12.11.24 12:00",
    read: true,
  },
  {
    author: "Herr Schmidt",
    title: "Wichtige Info zur Exkursion",
    date: "21.11.24 15:00",
    read: false,
  },
  {
    author: "Frau Meier",
    title: "Korrektur der letzten Klausur",
    date: "2024-11-18T12:45:00",
    read: true,
  },
  {
    author: "Max Mustermann",
    title: "Elternabend am nächsten Donnerstag",
    date: "2024-11-22T18:00:00",
    read: false,
  },
  {
    author: "Herr Weber",
    title: "Material für das nächste Projekt",
    date: "2024-11-21T09:00:00",
    read: true,
  },
  {
    author: "Frau Schulz",
    title: "Vertretung in der 3. Stunde",
    date: "2024-11-23T07:45:00",
    read: false,
  },
  {
    author: "Lisa Müller",
    title: "Info zu den Winterferien",
    date: "2024-11-24T13:30:00",
    read: false,
  },
  {
    author: "Herr Schmidt",
    title: "Abgabe der Facharbeit",
    date: "2024-11-20T14:15:00",
    read: true,
  },
  {
    author: "Frau Meier",
    title: "Rückgabe der Seminararbeit",
    date: "2024-11-25T11:00:00",
    read: false,
  },
];

const deadlinesDummyData = [
  { subject: "Informatik", task: "B. S. 72 Nr. 5", dueDate: "20.05.24" },
  { subject: "Sport", task: "5 Runden laufen", dueDate: "03.06.24" },
];

const HomeStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("HomeScreen");
    });

    return unsubscribe;
  }, []);

  return (
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
  );
};

export default HomeStack;

const NewsScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const InboxScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const DeadlineScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const HomeScreen = function ({ navigation }) {
  const [deadlines, setDeadlines] = React.useState(deadlinesDummyData);

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

  const inboxTemplate = (writer, reference, date, read) => (
    <View style={{ justifyContent: "center" }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "black", fontSize: 13, fontWeight: read ? "500" :"700" }}>
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
    </View>
  );

  const deadlineTemplate = (subject, task, date, place) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
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
            fontWeight: "500",
            color: "#363636",
          }}
        >
          {date}
        </Text>
      </View>
      <Checkbox
        onConfirm={() => {
          console.log(deadlinesDummyData);
          if (deadlines.length > 1) {
            const updatedDeadlines = deadlines.filter(
              (_, index) => index !== place
            );
            setDeadlines(updatedDeadlines);
          } else {
            setDeadlines([]);
          }
          console.log(deadlinesDummyData);
        }}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view} contentInsetAdjustmentBehavior="automatic">
        <MessageBox
          title="Neuigkeiten"
          style={{
            backgroundColor: "#0d7a18",
            borderRadius: 20,
          }}
          icon="newspaper-o"
          titleStyle={{ borderBottomWidth: newsBoxDummyData.length > 0 ? 0 : 1, borderBottomColor: "#b3b3ba" }}
          content={[
            {
              content: noEntryTemplate("aktuell keine Neuigkeiten"),
              style: [styles.iservContent, { borderWidth: 0 }],
            },
            {
              content: <Text style={{ color: "white", fontSize: 15 }}></Text>,
              style: [styles.iservContent, { borderWidth: 0 }],
            },
            {
              content: <Text style={{ color: "white", fontSize: 15 }}></Text>,
              style: [styles.iservContent, { borderWidth: 0 }],
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
                      iServInboxDummyData[0].author,
                      iServInboxDummyData[0].title,
                      iServInboxDummyData[0].date,
                      iServInboxDummyData[0].read
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
                      iServInboxDummyData[1].author,
                      iServInboxDummyData[1].title,
                      iServInboxDummyData[1].date,
                      iServInboxDummyData[1].read
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
                      iServInboxDummyData[2].author,
                      iServInboxDummyData[2].title,
                      iServInboxDummyData[2].date,
                      iServInboxDummyData[2].read
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
            borderBottomWidth: deadlines.length > 0 ? 0 : 1,
            borderBottomColor: "#b3b3ba",
          }}
          content={[
            {
              content:
                deadlines.length > 0
                  ? deadlineTemplate(
                      truncateText(deadlines[0].subject, 6),
                      truncateText(deadlines[0].task, 10),
                      deadlines[0].dueDate,
                      0
                    )
                  : noEntryTemplate("alle Aufgaben erledigt"),
              style: [
                styles.iservContent,
                { borderWidth: deadlines.length > 0 ? 0.5 : 0 },
              ],
            },
            {
              content:
                deadlines.length > 1
                  ? deadlineTemplate(
                      truncateText(deadlines[1].subject, 6),
                      truncateText(deadlines[1].task, 10),
                      deadlines[1].dueDate,
                      1
                    )
                  : deadlines.length > 0
                  ? noEntryTemplate("alle restlichen Aufgaben erledigt")
                  : null,
              style: [
                styles.iservContent,
                { borderWidth: deadlines.length > 1 ? 0.5 : 0 },
              ],
            },
            {
              content:
                deadlines.length > 2
                  ? deadlineTemplate(
                      truncateText(deadlines[2].subject, 6),
                      truncateText(deadlines[2].task, 10),
                      deadlines[2].dueDate,
                      2
                    )
                  : deadlines.length > 1
                  ? noEntryTemplate("alle restlichen Aufgaben erledigt")
                  : null,
              style: [
                styles.iservContent,
                { borderWidth: deadlines.length > 2 ? 0.5 : 0 },
              ],
            },
          ]}
          onPress={() => navigation.navigate("DeadlineScreen")}
        />
      </View>
    </SafeAreaView>
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
});
