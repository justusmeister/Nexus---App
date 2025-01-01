import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  InteractionManager,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";
import HomeworkScreen from "./OrganisationSubScreens/HomeworkScreen";
import YearCalendarScreen from "./OrganisationSubScreens/YearCalendarScreen";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

let hwGenericScreenTitle = "Mathe";

const OrganisationStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("TimeTableScreen");
    });

    return unsubscribe;
  }, []);

  insets = useSafeAreaInsets();

  return (
    <Stack.Navigator initialRouteName="MaterialTopTabs">
      <Stack.Screen
        name="MaterialTopTabs"
        component={MaterialTopTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GenericScreen"
        component={GenericScreen}
        options={{
          title: hwGenericScreenTitle,
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
  );
};

export default OrganisationStack;

const MaterialTopTabs = function () {
  return (
    <Tab.Navigator
      initialRouteName="TimeTableScreen"
      screenOptions={{
        tabBarActiveTintColor: "#333",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: "#EFEEF6",
          marginTop: insets.top,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#333",
          height: 3,
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
        name="YearCalendarScreen"
        component={YearCalendarScreen}
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

  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  useEffect(() => {
    const updateCurrentTime = () => {
      InteractionManager.runAfterInteractions(() => {
        setCurrentDate(
          new Date().toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      });
    };
    const timer = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / screenWidth);

    if (index < 3) {
      const firstWeek = weeks[0].index;
      const newWeeks = generateWeeks(firstWeek - 10, 3);
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
    const timeTableWeekIndex = item.index;
    return <TimeTable currentWeek={timeTableWeekIndex} />;
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.containerTimeTable}>
          <View
            style={{
              paddingRight: 10,
              height: 43,
              marginVertical: 10,
              marginLeft: 8,
              alignSelf: "flex-start",
              justifyContent: "center",
              backgroundColor: "#7d7d7d",
              borderRadius: 18,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "lightgrey",
            }}
          >
            <Icon.FontAwesome
              name="bookmark"
              size={25}
              color="#e37a02"
              style={{ marginHorizontal: 12 }}
            />

            <View>
              <Text style={{ fontWeight: "500", fontSize: 14, color: "#333" }}>
                Aktuelles Datum:
              </Text>
              <Text style={{ fontWeight: "700", fontSize: 15, color: "#333" }}>
                {currentDate}
              </Text>
            </View>
          </View>

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


const GenericScreen = function ({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={({}) => navigation.goBack()}>
          <Icon.AntDesign name="pluscircle" size={33} color="lightblue" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return <Text>teacherSearchInput</Text>;
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
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
  },
});
