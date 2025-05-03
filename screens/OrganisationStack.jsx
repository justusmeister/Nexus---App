import React, { useCallback, useState, useRef, memo } from "react";
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
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";
import YearCalendarScreen from "./OrganisationSubScreens/YearCalendarScreen";
import YearDetailedScreen from "./OrganisationSubScreens/YearDetailedScreen";
import { FlashList } from "@shopify/flash-list";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const OrganisationStack = function ({ navigation }) {
  insets = useSafeAreaInsets();

  return (
    <Stack.Navigator initialRouteName="MaterialTopTabs">
      <Stack.Screen
        name="MaterialTopTabs"
        component={MaterialTopTabs}
        options={{ headerShown: false }}
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
    <View
      style={{ flex: 1, backgroundColor: "#EFEEF6", paddingTop: insets.top }}
    >
      <Tab.Navigator
        initialRouteName="TimeTableScreen"
        screenOptions={{
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
                <ActivityIndicator size={"small"} color={"#333"} />
              </View>
            );
          },
          tabBarActiveTintColor: "#333",
          tabBarInactiveTintColor: "#888",
          tabBarLabelStyle: {
            fontSize: 13.5,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: "#EFEEF6",
            height: 48,
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
            tabBarLabel: "Stundenplan",
          }}
        />
        <Tab.Screen
          name="YearCalendarScreen"
          component={YearCalendarScreen}
          options={{
            tabBarLabel: "Jahreskalender",
          }}
        />
      </Tab.Navigator>
    </View>
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
  const tabBarHeight = useBottomTabBarHeight();
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

  useFocusEffect(
    useCallback(() => { const updateCurrentTime = () => {
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
  }, []));

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
      <SafeAreaView style={[styles.screen, { marginBottom: tabBarHeight + 6 }]}>
        <View style={styles.containerTimeTable}>
          <TouchableOpacity
            style={{
              paddingRight: 10,
              paddingVertical: 5,
              marginVertical: 10,
              marginLeft: 8,
              alignSelf: "flex-start",
              justifyContent: "center",
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
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: RFPercentage(1.92),
                  color: "#333",
                }}
              >
                Aktuelles Datum:
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: RFPercentage(2.05),
                  color: "#333",
                }}
              >
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
