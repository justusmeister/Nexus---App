import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import MessageBox from "../components/MessageBox";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderTab from "../components/HeaderTab";
import HeaderStack from "../components/HeaderStack";

const Stack = createNativeStackNavigator();

const HomeStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("HomeScreen");
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false, tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

const NewsScreen = function ({ navigation }) {
  return (
    <View>
      <HeaderStack onPress={() => navigation.goBack()} title="Neuigkeiten" />
      <Text>Moin</Text>
    </View>
  );
};

const HomeScreen = function ({ navigation }) {
  return (
    <View style={styles.container}>
      <HeaderTab title="Startseite" />
      <ScrollView contentContainerStyle={styles.view}>
        <MessageBox
          style={{ backgroundColor: "green", borderRadius: 20 }}
          onPress={() => {
            navigation.navigate("NewsScreen");
          }}
        />
        <MessageBox
          style={{ backgroundColor: "blue", borderRadius: 20, height: "38%" }}
        />
        <MessageBox style={{ backgroundColor: "red", borderRadius: 20 }} />
        <StatusBar />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 100,
  },
});
