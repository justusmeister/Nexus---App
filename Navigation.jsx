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
import LoginScreen from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { startDate, targetDate } = calculateHolidayAPIDates();

const Navigation = function () {
  const [publicHolidays, setHolidayDays] = useState(null);
  const [schoolHolidays, setHolidayPeriods] = useState(null);

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
      }
    };
    fetchHolidays();
  }, []);

  useEffect(() => {
    if (publicHolidays && schoolHolidays) {
      setHolidayData([{ data: publicHolidays }, { data: schoolHolidays }]);
    }
  }, [publicHolidays, schoolHolidays]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ presentation: "modal", title: "Einstellungen" }}
        />
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
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
        let Family = Icon.Ionicons;
        switch (route.name) {
          case "Home":
            icon = focused ? "newspaper" : "newspaper-outline";
            break;

          case "Organisation":
            Family = Icon.SimpleLineIcons;
            icon = focused ? "organization" : "organization";
            break;

          case "Search":
            icon = focused ? "search" : "search-outline";
            break;
        }

        return <Family name={icon} size={size} color={color} />;
      },
      tabBarActiveTintColor: "black",
      tabBarStyle: { position: "absolute" },
      tabBarBackground: () => (
        <BlurView
          tint="light"
          intensity={100}
          style={StyleSheet.absoluteFill}
        />
      ),
      headerShown: false,
    };
  };

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={setTabBarIcons}>
      <Tab.Screen
        name="Organisation"
        component={OrganisationStack}
        options={{
          title: "Organisation",
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Startseite",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          title: "Suche",
        }}
      />
    </Tab.Navigator>
  );
};
