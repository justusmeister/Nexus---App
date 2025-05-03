import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./screens/HomeStack";
import { BlurView } from "expo-blur";
import OrganisationStack from "./screens/OrganisationStack";
import * as Icon from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import SettingsScreen from "./screens/SettingsScreen";
import SearchStack from "./screens/SearchStack";
import { calculateHolidayAPIDates } from "./externMethods/calculateHolidayAPIDates";
import { useHolidayData } from "./contexts/HolidayDataContext";
import { createAdjustedHolidayDataMap } from "./externMethods/createAdjustedHolidayDataMap";
import { useEmailData } from "./contexts/EmailContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./screens/SplashScreen";
import GradesScreen from "./screens/GradesScreen";
import TodosScreen from "./screens/TasksSubScreens/TodosScreen";
import TasksStack from "./screens/TasksStack";
import OnboardingScreen from "./screens/OnboardingScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { startDate, targetDate } = calculateHolidayAPIDates();

const saveEmailsToStorage = async (emails) => {
  try {
    await AsyncStorage.setItem("emails", JSON.stringify(emails));
    await AsyncStorage.setItem(
      "emailsLastUpdated",
      new Date().toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  } catch (error) {
    console.error("❌ Fehler beim Speichern der E-Mails:", error);
  }
};

const loadEmailsFromStorage = async () => {
  try {
    const storedEmails = await AsyncStorage.getItem("emails");
    return storedEmails ? JSON.parse(storedEmails) : null;
  } catch (error) {
    console.error("❌ Fehler beim Laden der E-Mails:", error);
    return null;
  }
};

const fetchEmails = async (setEmails, setRefreshing) => {
  try {
    console.log("📨 Starte Anfrage an Server...");
    setRefreshing(true);

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

    if (!response.ok) {
      setRefreshing(false);
      return;
    }

    const data = await response.json();

    const sortedEmails = data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setEmails(sortedEmails);
    setRefreshing(false);
    await saveEmailsToStorage(sortedEmails);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der E-Mails:", error);
    setRefreshing(false);
  }
};

const Navigation = function () {
  const [publicHolidays, setHolidayDays] = useState(null);
  const [schoolHolidays, setHolidayPeriods] = useState(null);
  const { setMailData, setRefreshing } = useEmailData();
  const { holidayData, setHolidayData } = useHolidayData();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const schoolHolidaysResponse = await fetch(
          `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=DE&subdivisionCode=DE-NI&languageIsoCode=DE&validFrom=${startDate}&validTo=${targetDate}`
        );

        const schoolHolidaysData = await schoolHolidaysResponse.json();
        setHolidayPeriods(createAdjustedHolidayDataMap(schoolHolidaysData));
        const publicHolidaysResponse = await fetch(
          `https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&subdivisionCode=DE-NI&languageIsoCode=DE&validFrom=${startDate}&validTo=${targetDate}`
        );
        const publicHolidaysData = await publicHolidaysResponse.json();
        setHolidayDays(createAdjustedHolidayDataMap(publicHolidaysData));
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setHolidayPeriods(createAdjustedHolidayDataMap([]));
        setHolidayDays(createAdjustedHolidayDataMap([]));
      }
    };
    const loadAndFetchEmails = async () => {
      const cachedEmails = await loadEmailsFromStorage();
      setMailData(cachedEmails ?? ["loading"]);

      fetchEmails(setMailData, setRefreshing);
    };

    loadAndFetchEmails();
    fetchHolidays();
  }, []);

  useEffect(() => {
    if (publicHolidays && schoolHolidays) {
      setHolidayData([{ data: publicHolidays }, { data: schoolHolidays }]);
    }
  }, [publicHolidays, schoolHolidays]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnboardingScreen">
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            presentation: "modal",
            title: "Einstellungen",
            headerLargeTitle: true,
            headerStyle: { backgroundColor: "#EFEEF6" },
          }}
        />
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const Tabs = function () {
  const setTabBarIcons = ({ route }) => {
    return {
      tabBarIcon: ({ focused, size, color }) => {
        let icon;
        switch (route.name) {
          case "Home":
            icon = focused ? "home" : "home";
            break;

          case "Organisation":
            icon = focused ? "calendar" : "calendar";
            break;

          case "Tasks":
            icon = focused ? "check-square" : "check-square";
            break;

          case "Grades":
            icon = focused ? "award" : "award";
            break;
        }

        return (
          <Icon.Feather
            name={icon}
            size={focused ? size * 1.1 : size}
            color={color}
          />
        );
      },
      tabBarActiveTintColor: "black",
      tabBarStyle: {
        position: "absolute",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
        backgroundColor: "transparent",
      },
      tabBarBackground: () => (
        <BlurView
          tint="systemThinMaterialLight"
          intensity={200}
          style={StyleSheet.absoluteFill}
        />
      ),
      headerShown: false,
    };
  };

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={setTabBarIcons}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Startseite",
        }}
      />
      <Tab.Screen
        name="Organisation"
        component={OrganisationStack}
        options={{
          title: "Zeitplanung",
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={{
          title: "Aufgaben",
        }}
      />
      <Tab.Screen
        name="Grades"
        component={GradesScreen}
        options={{
          title: "Noten",
        }}
      />
    </Tab.Navigator>
  );
};
