import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";

const Stack = createNativeStackNavigator();

const OrganisationStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("TimeTableScreen");
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TimeTableScreen"
        component={TimeTableScreen}
        options={{
          title: "Stundenplan",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#EFEEF6", height: 1000 },
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
        name="YearTimeTableScreen"
        component={YearTimeTableScreen}
        options={{
          title: "Jahreskalendar",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="HomeworkScreen"
        component={HomeworkScreen}
        options={{
          title: "Notenrechner",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
  );
};

export default OrganisationStack;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TimeTableScreen = function ({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.containerTimeTable}>
          <View style={styles.customTabBar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("YearTimeTableScreen")}
            >
              <Icon.MaterialCommunityIcons
                name="timetable"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timetableBox}>
            <TimeTable />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

/* <FlatList
              data={days}
              horizontal
              renderItem={({ item }) => <TimeTable />}
              keyExtractor={(item) => item}
              snapToAlignment="start"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
            />*/

const YearTimeTableScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Jahreskalendar</Text>
    </View>
  );
};

const HomeworkScreen = function ({ navigation }) {
  return (
    <View>
      <Text>TEST</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 89,
  },
  containerTimeTable: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  timetableBox: {
    flex: 1,
    width: "100%",
    padding: 8,
    paddingTop: 0,
    marginTop: 62,
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
  },
  customTabBar: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 150,
    height: 50,
    backgroundColor: "black",
    borderRadius: 15,
    zIndex: 1,
  },
  sectionHeader: {
    backgroundColor: "#d3d3d3",
    padding: 10,
  },
  sectionText: {
    fontWeight: "bold",
  },
});
