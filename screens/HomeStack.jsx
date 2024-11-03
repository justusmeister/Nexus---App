import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MessageBox from "../components/MessageBox";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";

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
        options={{
          title: "Startseite",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#EFEEF6" },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("SettingsScreen")}
            >
              <Icon.Ionicons name="settings" size={31} />
            </TouchableOpacity>
          ),
        }}
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
  );
};

export default HomeStack;

const NewsScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const InboxScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const DeadlineScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const HomeScreen = function ({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.view}>
        <MessageBox
          title="Neuigkeiten"
          style={{
            backgroundColor: "#0d7a18",
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("NewsScreen")}
        />
        <MessageBox
          title="iServ Postfach"
          style={{
            backgroundColor: "#2165bf",
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("InboxScreen")}
        />
        <MessageBox
          title="anstehende Fristen"
          style={{
            backgroundColor: "#e02225",
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("DeadlineScreen")}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 14,
    marginBottom: 0,
  },
  view: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
});
