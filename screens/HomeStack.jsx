import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MessageBox from "../components/MessageBox";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

const iServInboxDummyData = [
  {
    autor: "Max Mustermann",
    title: "Ankündigung für die Klassenarbeit",
    date: "2024-11-21T15:00:00",
    read: false,
  },
  {
    autor: "Lisa Müller",
    title: "Neue Hausaufgabe für Montag",
    date: "2024-11-20T10:30:00",
    read: true,
  },
  {
    autor: "Herr Schmidt",
    title: "Wichtige Info zur Exkursion",
    date: "2024-11-19T08:15:00",
    read: false,
  },
  {
    autor: "Frau Meier",
    title: "Korrektur der letzten Klausur",
    date: "2024-11-18T12:45:00",
    read: true,
  },
  {
    autor: "Max Mustermann",
    title: "Elternabend am nächsten Donnerstag",
    date: "2024-11-22T18:00:00",
    read: false,
  },
  {
    autor: "Herr Weber",
    title: "Material für das nächste Projekt",
    date: "2024-11-21T09:00:00",
    read: true,
  },
  {
    autor: "Frau Schulz",
    title: "Vertretung in der 3. Stunde",
    date: "2024-11-23T07:45:00",
    read: false,
  },
  {
    autor: "Lisa Müller",
    title: "Info zu den Winterferien",
    date: "2024-11-24T13:30:00",
    read: false,
  },
  {
    autor: "Herr Schmidt",
    title: "Abgabe der Facharbeit",
    date: "2024-11-20T14:15:00",
    read: true,
  },
  {
    autor: "Frau Meier",
    title: "Rückgabe der Seminararbeit",
    date: "2024-11-25T11:00:00",
    read: false,
  },
];

const deadlinesDummyData = [
  { subject: "Mathe", task: "B. S. 72 Nr. 5", dueDate: "20.05.24" },
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view} contentInsetAdjustmentBehavior="automatic">
        <MessageBox
          title="Neuigkeiten"
          style={{
            backgroundColor: "#0d7a18",
            borderRadius: 20,
          }}
          content={[
            {
              content: (
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "500" }}
                >
                  aktuell keine Neuigkeiten
                </Text>
              ),
              style: [styles.iservContent, { borderWidth: 0.5 }],
            },
            {
              content: <Text>-</Text>,
              style: [styles.iservContent, { borderWidth: 0 }],
            },
            {
              content: <Text>-</Text>,
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
          content={[
            {
              content: (
                <Text style={{ color: "white", fontSize: 15 }}>Content 1</Text>
              ),
              style: [styles.iservContent, { borderWidth: 0.5 }],
            },
            {
              content: <Text>keine weiteren Einträge vorhanden</Text>,
              style: [styles.iservContent, { borderWidth: 0 }],
            },
            {
              content: <Text></Text>,
              style: [styles.iservContent, { borderWidth: 0 }],
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
          content={[
            {
              content: (
                <Text style={{ color: "white", fontSize: 15 }}>Content 1</Text>
              ),
              style: [styles.iservContent, { borderWidth: 0.5 }],
            },
            {
              content: <Text></Text>,
              style: [styles.iservContent, { borderWidth: 0.5 }],
            },
            {
              content: <Text></Text>,
              style: [styles.iservContent, { borderWidth: 0.5 }],
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
