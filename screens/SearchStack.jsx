import React, { useEffect, useState, Suspense } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import { SQLiteProvider } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

let dbLocal;

const loadDatabase = async () => {
  const dbName = "teacherAbbrevationsList.db";
  const dbAsset = require("../assets/db/teacherAbbrevationsList.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  /*if (fileInfo.exists) {
    console.log("Alte Datenbank gefunden. Lösche alte Datenbank...");
    await FileSystem.deleteAsync(dbFilePath, { idempotent: true });
  }*/

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }

  console.log("Datenbank geladen!");
  dbLocal = await SQLite.openDatabaseAsync(dbName);
};

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

const ResultList = function ({ data, alreadySearched }) {
  if (!data || data.length === 0 && alreadySearched) {
    return (
      <ScrollView contentContainerStyle={{ padding: 15, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#8E8E93",
          }}
        >
          Es wurden keine Einträge gefunden
        </Text>
      </ScrollView>
    );
  }

  const resultBox = ({ item }) => (
    <View
      style={{
        width: "100%",
        height: 100,
        marginVertical: 2,
        backgroundColor: "#c2c2c2",
        borderRadius: 20,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <Text style={{ marginHorizontal: 4, fontSize: 15, fontWeight: "500" }}>
          Lehrer:
        </Text>
        <Text style={{ marginHorizontal: 4, fontSize: 15, fontWeight: "500" }}>
          {item.teacherLastname}
        </Text>
      </View>
      <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: "500" }}>
        {item.teacherAbbrevation}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={resultBox}
      keyExtractor={(item) => item.id.toString()}
      style={{ marginHorizontal: 14, padding: 5 }}
    />
  );
};

const OnSearchAbbrevation = async function (db, searchValue, setResult, setAlreadySearched) {
  const queryResult = await db.getAllAsync(
    "SELECT * FROM teacherList WHERE teacherLastname LIKE ? ORDER BY teacherLastname",
    [`${searchValue}%`]
  );
  setResult(queryResult);
  setAlreadySearched(true);
};

const OpenedSearchScreen = function ({ navigation }) {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState([]);
  const [alreadySearched, setAlreadySearched] = useState(false);

  useEffect(() => {
    loadDatabase().catch((e) => console.error(e));
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#EFEEF6",
        marginTop: Platform.OS === "ios" ? 0 : 20,
      }}
    >
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
                autoFocus={true}
                value={inputText}
                onChangeText={(text) => {
                  setInputText(text);
                  OnSearchAbbrevation(dbLocal, text, setResult, setAlreadySearched);
                }}
                style={styles.teacherSearchInput}
              />
              {inputText.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setInputText("");
                    OnSearchAbbrevation(dbLocal, "", setResult);
                  }}
                >
                  <Icon.MaterialIcons
                    name="clear"
                    size={20}
                    color="black"
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
        <Suspense
          fallback={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="black" />
            </View>
          }
        >
          <SQLiteProvider databaseName="teacherAbbrevationsList.db" useSuspense>
            <ResultList data={result} alreadySearched={alreadySearched} />
          </SQLiteProvider>
        </Suspense>
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
    borderBottomWidth: 1,
    borderBottomColor: "#dedee3",
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
