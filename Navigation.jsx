import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./screens/HomeStack";
import { BlurView } from "expo-blur";
import OrganisationStack from "./screens/OrganisationStack";
import * as Icon from "@expo/vector-icons";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import SettingsScreen from "./screens/SettingsScreen";
import NotesInputScreen from "./screens/TasksSubScreens/NotesInputScreen";
import { calculateHolidayAPIDates } from "./utils/calculateHolidayAPIDates";
import { useHolidayData } from "./contexts/HolidayDataContext";
import { createAdjustedHolidayDataMap } from "./utils/createAdjustedHolidayDataMap";
import { useEmailData } from "./contexts/EmailContext";
import SplashScreen from "./screens/SplashScreen";
import GradesStack from "./screens/GradesStack";
import TasksStack from "./screens/TasksStack";
import OnboardingScreen from "./screens/OnboardingScreen";
import AuthStack from "./screens/AuthStack";
import { getAsyncItem } from "./utils/asyncStorage";
import Toast from "react-native-toast-message";
import { getFullWeekPlan } from "./utils/webuntisFetchData";
import { useTimetableData } from "./contexts/TimetableContext";
import MailCore from "react-native-mailcore";


// Thick BottomTabIcons:
import HomeThick from "./assets/extraIcons/boldTabBarIcons/home.svg";
import OrganisationThick from "./assets/extraIcons/boldTabBarIcons/calendar.svg";
import TasksThick from "./assets/extraIcons/boldTabBarIcons/check-square.svg";
import GradesThick from "./assets/extraIcons/boldTabBarIcons/award.svg";
import { useThemePreference } from "./hooks/useThemePreference";
import { DarkTheme, LightTheme } from "./constants/theme";

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
  const [initialRoute, setInitialRoute] = useState(null);
  const { setTimetableData } = useTimetableData();

  const { colorScheme } = useThemePreference();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const onboardingSeen = await getAsyncItem("onboarded");
        if (onboardingSeen === "true") {
          setInitialRoute("SplashScreen");
        } else {
          setInitialRoute("OnboardingScreen");
        }
      } catch {
        setInitialRoute("OnboardingScreen");
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const cachedEmails = await loadEmailsFromStorage();
        setMailData(cachedEmails ?? ["loading"]);
        fetchEmails(setMailData, setRefreshing);

        // DE / CH / AT
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
      } catch {
        Toast.show({
          type: "error",
          text1: "Fehler beim Abrufen der Feriendaten!",
          visibilityTime: 4000,
        });
      }
    };

    if (initialRoute && initialRoute !== "OnboardingScreen") {
      fetchAppData();
      const fetchTimetable = async () => {
        const timetableWeeks = await getFullWeekPlan();
        //console.log(JSON.stringify(timetableWeeks, null, 2));
        setTimetableData(timetableWeeks);
      };

      fetchTimetable();
    }
  }, [initialRoute]);

  useEffect(() => {
    if (publicHolidays && schoolHolidays) {
      setHolidayData([{ data: publicHolidays }, { data: schoolHolidays }]);
    }
  }, [publicHolidays, schoolHolidays]);

  if (!initialRoute) return null;

  return (
    <NavigationContainer theme={colorScheme === "dark" ? DarkTheme : LightTheme}>
      <Stack.Navigator initialRouteName={initialRoute}>
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
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false, gestureEnabled: false, animation: "fade", animationDuration: 35 }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            presentation: "modal",
            title: "Einstellungen",
            headerTitleStyle: { fontFamily: DarkTheme.fonts.semibold },
            headerStyle: { backgroundColor: colorScheme === "dark" ? DarkTheme.colors.background : LightTheme.colors.background },
          }}
        />
        {/*<Stack.Screen
          name="BottomSheetsStack"
          component={BottomSheetsStack}
          options={{ headerShown: false, gestureEnabled: false }}
        />*/}
        <Stack.Screen
          name="NotesInputScreen"
          component={NotesInputScreen}
          options={{
            title: "Notizen",
            headerShadowVisible: false,
            presentation: Platform.OS === "ios" ? "modal" : "fullScreenModal",
            headerTitleStyle: { fontFamily: DarkTheme.fonts.semibold },
            headerStyle: { backgroundColor: colorScheme === "dark" ? DarkTheme.colors.background : LightTheme.colors.background }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const Tabs = function () {
  const { colors, spacing, radius, fonts, bottomTabTint } = useTheme();

  const setTabBarIcons = ({ route }) => {
    return {
      tabBarIcon: ({ focused, size, color }) => {
        let icon;
        switch (route.name) {
          case "Home":
            icon = focused ? "home1" : "home";
            break;

          case "Organisation":
            icon = focused ? "calendar1" : "calendar";
            break;

          case "Tasks":
            icon = focused ? "check-square1" : "check-square";
            break;

          case "Grades":
            icon = focused ? "award1" : "award";
            break;
        }

        if (icon === "home1")
          return ( <HomeThick width={size * 1.1} height={size * 1.1} stroke={colors.text}/> )
        else if (icon === "calendar1")
          return ( <OrganisationThick width={size * 1.1} height={size * 1.1} stroke={colors.text}/> )
        else if (icon === "check-square1")
          return ( <TasksThick width={size * 1.1} height={size * 1.1} stroke={colors.text}/> )
        else if (icon === "award1")
          return ( <GradesThick width={size * 1.1} height={size * 1.1} stroke={colors.text}/> )


        return (
          <Icon.Feather
            name={icon}
            size={focused ? size * 1.1 : size}
            color={colors.text + "99"}
          />
        );
      },
      tabBarActiveTintColor: colors.text,
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
      tabBarLabelStyle: {
        fontFamily: fonts.bold
      },
      tabBarBackground: () => (
        <BlurView
          tint={bottomTabTint}
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
        component={GradesStack}
        options={{
          title: "Noten",
        }}
      />
    </Tab.Navigator>
  );
};
