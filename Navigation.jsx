import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./screens/HomeStack";
import { BlurView } from "expo-blur";
import OrganisationScreen from "./screens/OrganisationScreen";
import * as Icon from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import SettingsScreen from "./screens/SettingsScreen";
import SearchStack from "./screens/SearchStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = function () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ headerShown: false, presentation: "modal" }}
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
        component={OrganisationScreen}
        options={{
          title: "Stundenplan",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#EFEEF6" },
          headerRight: () => (
            <TouchableOpacity
              onPress={({}) => navigation.navigate("SettingsScreen")}
            >
              <Icon.Ionicons name="settings" size={31} />
            </TouchableOpacity>
          ),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
