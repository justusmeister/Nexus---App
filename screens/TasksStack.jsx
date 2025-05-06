import React, { useCallback, useState, useRef, memo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  InteractionManager,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";
import HomeworkScreen from "./TasksSubScreens/HomeworkScreen";
import GenericScreen from "./TasksSubScreens/GenericSubjectScreen";
import NotesScreen from "./TasksSubScreens/NotesScreen";
import NotesInputScreen from "./TasksSubScreens/NotesInputScreen";
import TodosScreen from "./TasksSubScreens/TodosScreen";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TasksStack = function ({ navigation }) {

  return (
    <Stack.Navigator initialRouteName="MaterialTopTabs">
      <Stack.Screen
        name="MaterialTopTabs"
        component={MaterialTopTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GenericScreen"
        component={GenericScreen}
        options={{
          title: "Fach",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="NotesScreen"
        component={NotesScreen}
        options={{
          title: "allgemeine Notizen",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="NotesInputScreen"
        component={NotesInputScreen}
        options={{
          title: "Notizen",
          headerShadowVisible: false,
          presentation: Platform.OS === "ios" ? "modal" : "fullScreenModal",
          headerStyle: {
            backgroundColor: "#EFEEF6",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default TasksStack;

const MaterialTopTabs = function () {
  insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#EFEEF6", paddingTop: insets.top }}
    >
      <Tab.Navigator
        initialRouteName="HomeworkScreen"
        screenOptions={{
          lazy: true,
          lazyPlaceholder: () => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#EFEEF6",
                }}
              >
                <ActivityIndicator size={"small"} color={"#333"} />
              </View>
            );
          },
          tabBarActiveTintColor: "#333",
          tabBarInactiveTintColor: "#888",
          tabBarLabelStyle: {
            fontSize: 13.5,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: "#EFEEF6",
            height: 48,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#333",
            height: 3,
          },
        }}
      >
      <Tab.Screen
        name="HomeworkScreen"
        component={HomeworkScreen}
        options={{
          tabBarLabel: "Hausaufgaben",
        }}
      />
        <Tab.Screen
          name="TodosScreen"
          component={TodosScreen}
          options={{
            tabBarLabel: "allgemeine Todo's",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};