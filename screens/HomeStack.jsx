import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import InboxScreen from "./HomeSubScreens/InboxScreen";
import NewsScreen from "./HomeSubScreens/NewsScreen";
import DeadlineScreen from "./HomeSubScreens/DeadlineScreen";
import { DeadlinesProvider } from "../contexts/DeadlinesContext";
import HomeScreen from "./HomeSubScreens/HomeScreen";
import FocusScreen from "./HomeSubScreens/FocusScreen";

const Stack = createNativeStackNavigator();

const HomeStack = function ({ navigation }) {
  return (
    <DeadlinesProvider>
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
          name="Focus"
          component={FocusScreen}
          options={{ headerShown: false, presentation: "fullScreenModal" }} 
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
    </DeadlinesProvider>
  );
};

export default HomeStack;
