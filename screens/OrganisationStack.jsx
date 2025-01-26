import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  InteractionManager,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";
import HomeworkScreen from "./OrganisationSubScreens/HomeworkScreen";
import YearCalendarScreen from "./OrganisationSubScreens/YearCalendarScreen";
import GenericScreen from "./OrganisationSubScreens/GenericScreen";
import YearDetailedScreen from "./OrganisationSubScreens/YearDetailedScreen";
import { FlashList } from "@shopify/flash-list";

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
          title: "Fach",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="YearDetailedScreen"
        component={YearDetailedScreen}
        options={{
          title: "Monatsdetaillansicht",
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
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 120 },
        lazy: true,
        lazyPlaceholder: () => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#EFEEF6",
              }}
            >
              <ActivityIndicator size={"large"} color={"#333"} />
            </View>
          );
        },
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
      id: `week-${weekNumber}`,
    };
  });

const TimeTableScreen = function ({ navigation }) {
  const flashListRef = useRef();

  const [weeks, setWeeks] = useState(generateWeeks(-10, 15));
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

  let isGeneratingWeeks = false;

  const handleScroll = (event) => {
    if (isGeneratingWeeks) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / screenWidth);

    if (index < 3) {
      isGeneratingWeeks = true;
      const firstWeek = weeks[0].index;
      const newWeeks = generateWeeks(firstWeek - 10, 3);
      setWeeks((prev) => [...newWeeks, ...prev]);
      flashListRef.current.scrollToIndex({
        index: index + 3,
        animated: false,
      });
      setCurrentIndex((prev) => prev + 3);
      isGeneratingWeeks = false;
    }

    if (index > weeks.length - 4) {
      isGeneratingWeeks = true;
      const lastWeek = weeks[weeks.length - 1].index;
      const newWeeks = generateWeeks(lastWeek + 1, 3);
      setWeeks((prev) => [...prev, ...newWeeks]);
      isGeneratingWeeks = false;
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
          <TouchableOpacity
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
            onPress={() =>
              flashListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
              })
            }
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
          </TouchableOpacity>

          <View style={styles.timetableBox}>
            <FlashList
              ref={flashListRef}
              data={weeks}
              renderItem={renderItem}
              horizontal
              pagingEnabled
              estimatedItemSize={screenWidth}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
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
  addButton: {
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
