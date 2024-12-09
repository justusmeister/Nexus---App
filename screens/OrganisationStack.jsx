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
import * as Icon from "@expo/vector-icons";
import TimeTable from "../components/TimeTable";

const Stack = createNativeStackNavigator();

const OrganisationStack = function ({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      navigation.navigate("TimeTableScreen");
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TimeTableScreen"
        component={TimeTableScreen}
        options={{
          title: "Stundenplan",
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
        name="YearTimeTableScreen"
        component={YearTimeTableScreen}
        options={{
          title: "Jahreskalendar",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="HomeworkScreen"
        component={HomeworkScreen}
        options={{
          title: "Notenrechner",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
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
          <View style={styles.customTabBar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("YearTimeTableScreen")}
            >
              <Icon.MaterialCommunityIcons
                name="timetable"
                size={30}
                color="white"
              />
            </TouchableOpacity>
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

const YearTimeTableScreen = function ({ navigation }) {
  return (
    <View>
      <Text>Jahreskalendar</Text>
    </View>
  );
};

const HomeworkScreen = function ({ navigation }) {
  return (
    <View>
      <Text>TEST</Text>
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
  customTabBar: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 150,
    height: 50,
    backgroundColor: "black",
    borderRadius: 15,
    zIndex: 1,
  },
});
