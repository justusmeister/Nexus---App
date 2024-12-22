import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const OrganisationStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("TimeTableScreen");
    });

    return unsubscribe;
  }, []);

  insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="TimeTableScreen"
      screenOptions={{
        tabBarActiveTintColor: "#333", // Textfarbe für aktive Tabs
        tabBarInactiveTintColor: "#888", // Textfarbe für inaktive Tabs
        tabBarLabelStyle: {
          fontSize: 9, // Schriftgröße
          fontWeight: "600", // Fetter Text für Lesbarkeit
        },
        tabBarStyle: {
          backgroundColor: "#EFEEF6", // Hintergrundfarbe der Leiste
          marginTop: insets.top,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#333", // Indikator (die untere Linie) wird sichtbar
          height: 3, // Dicke der Indikator-Linie
        },
      }}
    >
      <Tab.Screen
        name="TimeTableScreen"
        component={TimeTableScreen}
        options={{
          tabBarLatitlbel: "Stundenplan",
        }}
      />
      <Tab.Screen
        name="YearTimeTableScreen"
        component={YearTimeTableScreen}
        options={{
          tabBarLabel: "Jahreskalendar",
        }}
      />
      <Tab.Screen
        name="HomeworkScreen"
        component={HomeworkScreen}
        options={{
          tabBarLabel: "Hausaufgaben",
        }}
      />
    </Tab.Navigator>
  );
};

export default OrganisationStack;

const screenWidth = Dimensions.get("window").width - 44;

const generateWeeks = (startWeek, count) =>
  Array.from({ length: count }, (_, i) => {
    const weekNumber = startWeek + i;
    return {
      index: weekNumber,
      display: weekNumber < -4 || weekNumber > 4 ? "" : `Woche ${weekNumber}`,
    };
  });

const TimeTableScreen = function ({ navigation }) {
  const flatListRef = useRef();

  const [weeks, setWeeks] = useState(generateWeeks(-10, 21));
  const [currentIndex, setCurrentIndex] = useState(10);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / screenWidth);

    if (index < 3) {
      const firstWeek = weeks[0].index;
      const newWeeks = generateWeeks(firstWeek - 10, 10);
      setWeeks((prev) => [...newWeeks, ...prev]);
      flatListRef.current.scrollToIndex({
        index: index + 10,
        animated: false,
      });
    }

    if (index > weeks.length - 4) {
      const lastWeek = weeks[weeks.length - 1].index;
      const newWeeks = generateWeeks(lastWeek + 1, 10);
      setWeeks((prev) => [...prev, ...newWeeks]);
    }
  };

  const renderItem = ({ item }) => {
    return <TimeTable currentWeek={item.index} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.containerTimeTable}>
          <View style={styles.timetableBox}>
            <FlatList
              ref={flatListRef}
              data={weeks}
              renderItem={renderItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.index.toString()}
              onMomentumScrollEnd={handleScroll}
              initialScrollIndex={currentIndex}
              getItemLayout={(_, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const YearTimeTableScreen = function ({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.containerTimeTable}>
          <View style={styles.timetableBox}></View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const HomeworkScreen = function ({ navigation }) {
  const resultBox = ({ item }) => (
    <View
      style={{
        width: "100%",
        height: 100,
        marginVertical: 2,
        backgroundColor: "#c2c2c2",
        borderRadius: 15,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <Text style={{ marginHorizontal: 4, fontSize: 15, fontWeight: "500" }}>
          test
        </Text>
        <Text style={{ marginHorizontal: 4, fontSize: 15, fontWeight: "500" }}>
          test
        </Text>
      </View>
      <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: "500" }}>
        Test
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <View style={[styles.screen, { marginBottom: 79, marginTop: 0 }]}>
        <FlatList
          data={["Schule", "Informatik", "Mathe"]}
          renderItem={resultBox}
          keyExtractor={(id) => id.toString()}
          style={{ paddingVertical: 5 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 89,
  },
  containerTimeTable: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  timetableBox: {
    flex: 1,
    width: "100%",
    padding: 8,
    paddingTop: 0,
    marginTop: 62,
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
  },
});
