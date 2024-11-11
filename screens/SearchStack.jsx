import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SQLite from "expo-sqlite";
import * as Icon from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

const Stack = createNativeStackNavigator();

// Globale Variable, um die geöffnete Datenbankverbindung zu speichern
let db = null;

const OpenDatabase = async () => {
  if (db) {
    // Gibt die Datenbank zurück, falls sie bereits geöffnet ist
    return db;
  }

  try {
    // Pfad, wo die Datenbank im App-Speicher liegen wird
    const dbPath = `${FileSystem.documentDirectory}SQLite/teacherAbbrevationsList.db`;

    // Prüfe, ob die Datenbank bereits im App-Speicher existiert
    const dbExists = await FileSystem.getInfoAsync(dbPath);

    if (!dbExists.exists) {
      // Asset laden und kopieren, falls die Datei noch nicht existiert
      const asset = Asset.fromModule(
        require("../assets/db/teacherAbbrevationsList.db")
      );

      // Asset laden, um die URI verfügbar zu machen
      await Asset.loadAsync(asset);

      // Verzeichnis SQLite erstellen, falls es noch nicht existiert
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );

      // Kopiere die Datenbankdatei in das App-Verzeichnis
      await FileSystem.downloadAsync(asset.uri, dbPath);
    }

    // Öffne die Datenbankverbindung und speichere sie in der `db`-Variablen
    db = await SQLite.openDatabaseAsync("teacherAbbrevationsList.db");
    return db;
  } catch (error) {
    console.error("Fehler beim Öffnen der Datenbank:", error);
  }
};


const SearchStack = function ({ navigation }) {
  useEffect(() => {}, []);

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
      <Stack.Screen
        name="OpenedSearchScreen"
        component={OpenedSearchScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "fade",
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
        <Pressable
          style={styles.inputBox}
          onPress={() => navigation.navigate("OpenedSearchScreen")}
        >
          <Icon.Ionicons
            name="search"
            size={22}
            color={"#8E8E93"}
            style={{ marginLeft: 3 }}
          />
          <Text style={styles.textInput}>Nach Lehrerkürzeln suchen </Text>
        </Pressable>

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
              size={20}
              color={"white"}
              style={styles.calculatorIcon}
            />
            <Text style={styles.buttonText}>Schnittrechner Punktesystem</Text>
          </Pressable>

          <Pressable
            style={styles.pressable}
            onPress={() => {
              navigation.navigate("GradesScreen");
              console.log("test");
            }}
          >
            <Icon.SimpleLineIcons
              name="calculator"
              size={20}
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

const queryDatabase = async () => {
  const dbInstance = await OpenDatabase();
  dbInstance.transaction((tx) => {
    tx.executeSql("SELECT * FROM teacherList", [], (_, { rows }) => {
      console.log("Abfrageergebnisse:", rows._array);
    });
  });
};

const OnSearchAbbrevation = async function (searchValue) {
  (async () => {
    await queryDatabase();
  })();
};

const OpenedSearchScreen = function ({ navigation }) {
  const searchField = useRef(null);

  const [inputText, setInputText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      searchField.current?.focus();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <View style={styles.backgroundOverlay}>
        <View style={styles.headerSearch}>
          <View style={styles.searchBarAButton}>
            <View style={styles.searchInputBox}>
              <Icon.Ionicons
                name="search"
                size={20}
                color={"#8E8E93"}
                style={{ width: "10%" }}
              />
              <TextInput
                placeholder="Suchen"
                placeholderTextColor={"#8E8E93"}
                ref={searchField}
                value={inputText} // Text wird vom State gesteuert
                onChangeText={(text) => {
                  setInputText(text);
                  OnSearchAbbrevation(inputText);
                }}
                style={styles.teacherSearchInput}
              />
              {inputText.length > 0 && (
                <TouchableOpacity onPress={() => setInputText("")}>
                  <Icon.MaterialIcons
                    name="clear"
                    size={20}
                    color="black"
                    onPress={() => setInputText("")}
                    style={{ minWidth: "10%" }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.quitButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.quitText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const PointsScreen = function () {
  return (
    <View>
      <Text>Moin</Text>
    </View>
  );
};

const GradesScreen = function () {
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
    minWidth: "65%",
    padding: 8,
    borderRadius: 16,
    marginTop: 5,
    backgroundColor: "#dedee3",
    marginHorizontal: 14,
  },
  textInput: {
    margin: 4,
    color: "#8E8E93",
    fontSize: 17.5,
    fontWeight: "500",
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

  backgroundOverlay: {
    flex: 1,
  },
  headerSearch: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    width: "100%",
    height: 55,
    //borderBottomWidth: 1,
    //borderBottomColor: "#dedee3",
  },
  searchBarAButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  quitButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 3,
    marginRight: 14,
  },
  quitText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  searchInputBox: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    minWidth: "65%",
    maxWidth: "65%",
    padding: 8,
    borderRadius: 13,
    backgroundColor: "#dedee3",
    marginLeft: 14,
  },
  teacherSearchInput: {
    fontSize: 16,
    minWidth: "78%",
    maxWidth: "78%",
    fontWeight: "500",
    marginHorizontal: 4,
  },
});
