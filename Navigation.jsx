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
import { NativeModules } from "react-native";
const { MailCoreModule } = NativeModules;

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

const saveUIDsToStorage = async (uids) => {
  try {
    await AsyncStorage.setItem("uids", JSON.stringify(uids));
  } catch (error) {
    console.error("❌ Fehler beim Speichern der UIDs:", error);
  }
};

const loadUIDsFromStorage = async () => {
  try {
    const storedUIDs = await AsyncStorage.getItem("uids");
    return storedUIDs ? JSON.parse(storedUIDs) : [];
  } catch (error) {
    console.error("❌ Fehler beim Laden der UIDs:", error);
    return [];
  }
};


const fetchEmails = async (setEmails, setRefreshing) => {
  try {
    console.log("📨 Starte direkte IMAP-Anfrage...");
    setRefreshing(true);

    // Bestehende UIDs aus Storage laden
    const storedUIDs = await loadUIDsFromStorage();

    const imapSession = await MailCore.imapSession({
      hostname: "imap.urs-os.de",
      port: 993,
      username: "justus.meister",
      password: "nivsic-wuGnej-9kyvke",
      connectionType: "TLS", // oder "SSL/TLS" je nach Server
    });

    // Alle UIDLIST vom Server holen
    const uidResults = await imapSession.fetchUIDs("INBOX", "ALL"); 
    const allUIDs = uidResults.map((r) => r.uid).sort((a, b) => a - b);

    // Nur die UIDs, die noch nicht lokal gespeichert sind
    const newUIDs = allUIDs.filter((uid) => !storedUIDs.includes(uid));

    // Nur die letzten 20 insgesamt wollen wir behalten
    const last20UIDs = allUIDs.slice(-20);

    // Inhalte der neuen UIDs holen
    const newEmails = await Promise.all(
      newUIDs.map(async (uid) => {
        const msg = await imapSession.fetchMessageByUID("INBOX", uid, {
          requestKind: MailCore.requestKind.fullHeaders |
                       MailCore.requestKind.structure |
                       MailCore.requestKind.fullBody |
                       MailCore.requestKind.flags,
        });

        return {
          uid,
          subject: msg.header.subject,
          from: msg.header.from,
          date: msg.header.date,
          read: msg.flags.includes("\\Seen"),
          text: msg.plainTextBody,
          html: msg.htmlBody,
          attachments: msg.attachments.map((att) => ({
            filename: att.filename,
            mimetype: att.mimeType,
            data: att.data, // bereits base64
          })),
        };
      })
    );

    // Emails zusammenführen (neue + alte gespeicherte)
    let updatedEmails = newEmails.concat(await loadEmailsFromStorage() || []);

    // Auf 20 beschränken & nach Datum sortieren
    updatedEmails = updatedEmails
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    // UIDs & Emails speichern
    const updatedUIDs = last20UIDs;
    await saveUIDsToStorage(updatedUIDs);
    await saveEmailsToStorage(updatedEmails);

    // State setzen
    setEmails(updatedEmails);
    setRefreshing(false);

  } catch (error) {
    console.error("❌ Fehler beim Abrufen der E-Mails:", error);

    console.log("MailCore:", MailCore);
console.log("NativeModules:", NativeModules);
    setRefreshing(false);
  }
};

const loadMails = async () => {
  try {
    // Verbindung herstellen
    await MailCoreModule.connect(
      "imap.urs-os.de",
      "pswd",
      "justus.meister",
      993
    );

    // Neueste Mails abrufen
    const mails = await MailCoreModule.fetchLatest();
    console.log("📩 Abgerufene Mails:", mails);

  } catch (error) {
    console.error("❌ Fehler beim Abrufen der E-Mails:", error);
  } finally {
    // Wird IMMER ausgeführt – auch bei Fehler
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
