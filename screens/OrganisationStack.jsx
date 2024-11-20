import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";

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
          title: "Punkterechner",
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

const TimeTableScreen = function ({ navigation }) {
  return (
    <>
      <View style={styles.customTabBar}></View>
      <SafeAreaView
        style={styles.screen}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.container}>
          <View style={styles.timetableBox}></View>
        </View>
      </SafeAreaView>
    </>
  );
};

const YearTimeTableScreen = function ({ navigation }) {
  return (
    <View>
      <Text>TEST</Text>
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
    backgroundColor: "#EFEEF6",
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 60,
  },
  timetableBox: {
    width: "100%",
    height: "100%",
    backgroundColor: "grey",
    borderRadius: 15,
  },
  customTabBar: {
    position: "absolute",
    right: 10,
    top: 40,
    width: 50,
    height: 80,
    backgroundColor: "green",
  },
});
