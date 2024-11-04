import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

const SearchStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("SearchScreen");
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: "Kürzelsuche",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#EFEEF6", height: 1000 },
          headerSearchBarOptions: {
            placeholder: "Suchen",
            cancelButtonText: "Abbrechen",
          },
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
        name="PointsScreen"
        component={PointsScreen}
        options={{
          title: "Punkterechner",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="GradesScreen"
        component={GradesScreen}
        options={{
          title: "Notenrechner",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;

const SearchScreen = function ({ navigation }) {
  return (
    <ScrollView
      contentStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ backgroundColor: "#EFEEF6" }}>
        <View style={styles.buttonsBox}>
          <Pressable
            style={[
              styles.pressable,
              {
                borderBottomWidth: 0.5,
                borderColor: "white",
                backgroundColor: "#596270",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              },
            ]}
            onPress={() => navigation.navigate("PointsScreen")}
          >
            <Icon.SimpleLineIcons
              name="calculator"
              size={22}
              color={"white"}
              style={styles.calculatorIcon}
            />
            <Text style={styles.buttonText}>Schnittrechner Punktesystem</Text>
          </Pressable>

          <Pressable
            style={styles.pressable}
            onPress={() => navigation.navigate("GradesScreen")}
          >
            <Icon.SimpleLineIcons
              name="calculator"
              size={22}
              color={"white"}
              style={styles.calculatorIcon}
            />
            <Text style={styles.buttonText}>Schnittrechner Notensystem</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const PointsScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const GradesScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputBox: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: "85%",
    padding: 6,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "#dcddde",
  },
  textInput: {
    height: 25,
    maxWidth: "85%",
    minWidth: "60%",
    color: "black",
    fontSize: 17,
    marginHorizontal: 4,
  },
  buttonsBox: {
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 14,
    backgroundColor: "#f5a002",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
    padding: 15,
  },
  calculatorIcon: {
    marginLeft: 15,
  },
});
