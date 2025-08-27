import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import InboxScreen from "./HomeSubScreens/InboxScreen";
import NewsScreen from "./HomeSubScreens/NewsScreen";
import DeadlineScreen from "./HomeSubScreens/DeadlineScreen";
import { DeadlinesProvider } from "../contexts/DeadlinesContext";
import HomeScreen from "./HomeSubScreens/HomeScreen";
import FocusScreen from "./HomeSubScreens/FocusScreen";
import { useNavigation, useTheme } from "@react-navigation/native";
import DayOverviewScreen from "./HomeSubScreens/DayOverviewScreen";
import CustomHeader from "../components/General/CustomHeader";
import CustomBackButton from "../components/General/CustomBackButton";

const Stack = createNativeStackNavigator();

const HomeStack = function ({ navigation }) {
  const { colors, spacing, radius, fonts } = useTheme();

  return (
    <DeadlinesProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            header: () => (
              <CustomHeader
                title="Hallo, Justus!"
                onSettingsPress={() => navigation.navigate("SettingsScreen")}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Focus"
          component={FocusScreen}
          options={{ headerShown: false, presentation: "fullScreenModal", gestureDirection: "vertical", gestureEnabled: true, }} 
        />
        <Stack.Screen 
          name="DayOverview"
          component={DayOverviewScreen}
          options={{ headerShown: false, presentation: "fullScreenModal" }} 
        />
        <Stack.Screen
          name="NewsScreen"
          component={NewsScreen}
          options={{
            title: "Neuigkeiten",
            headerTitleStyle: { fontFamily: fonts.semibold },
            headerStyle: { backgroundColor: colors.background },
            headerLeft: () => <CustomBackButton />,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="InboxScreen"
          component={InboxScreen}
          options={{
            title: "Posteingang",
            headerTitleStyle: { fontFamily: fonts.semibold },
            headerStyle: { backgroundColor: colors.background },
            headerLeft: () => <CustomBackButton />,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="DeadlineScreen"
          component={DeadlineScreen}
          options={{
            title: "Termine & Fristen",
            headerTitleStyle: { fontFamily: fonts.semibold },
            headerStyle: { backgroundColor: colors.background },
            headerLeft: () => <CustomBackButton />,
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </DeadlinesProvider>
  );
};

export default HomeStack;
