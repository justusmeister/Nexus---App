import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
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
    <ScrollView
      contentStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ backgroundColor: "#EFEEF6" }}></View>
    </ScrollView>
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
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEEF6",
  },
});
