import {
  View,
  ActivityIndicator,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeworkScreen from "./TasksSubScreens/HomeworkScreen";
import GenericScreen from "./TasksSubScreens/GenericSubjectScreen";
import NotesScreen from "./TasksSubScreens/NotesScreen";
import TodosScreen from "./TasksSubScreens/TodosScreen";
import { useTheme } from "@react-navigation/native";
import CustomBackButton from "../components/General/CustomBackButton";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TasksStack = function ({ navigation }) {
  const { colors, fonts } = useTheme();

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
          headerTitleStyle: { fontFamily: fonts.semibold },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => <CustomBackButton />,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="NotesScreen"
        component={NotesScreen}
        options={{
          title: "allgemeine Notizen",
          headerTitleStyle: { fontFamily: fonts.semibold },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => <CustomBackButton />,
          headerShadowVisible: false,
        }}
      />
      
    </Stack.Navigator>
  );
};

export default TasksStack;

const MaterialTopTabs = function () {
  insets = useSafeAreaInsets();
  const { colors, fonts } = useTheme();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}
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
                  backgroundColor: colors.background,
                }}
              >
                <ActivityIndicator size={"small"} color={colors.primary} />
              </View>
            );
          },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.text + "99",
          tabBarLabelStyle: {
            fontSize: 13.5,
            fontFamily: fonts.bold
          },
          tabBarStyle: {
            backgroundColor: colors.background,
            height: 48,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
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