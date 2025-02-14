import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Switch,
  Pressable,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import { useHolidayData } from "../../contexts/HolidayDataContext";
import * as Icon from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { BlurView } from "expo-blur";
import DeadlineBottomSheet from "../../components/DeadlineBottomSheet";
import { RFPercentage } from "react-native-responsive-fontsize";

const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

function createEventMap(events) {
  const eventMap = new Map();

  events.singleEvents.forEach((event) => {
    const singleEvent = {
      day: event.day,
      eventType: event.eventType,
      name: event.name,
      eventCategory: 1,
    };

    if (eventMap.has(event.day)) {
      eventMap.get(event.day).push(singleEvent);
    } else {
      eventMap.set(event.day, [singleEvent]);
    }
  });

  events.eventPeriods.forEach((period) => {
    let currentDate = new Date(period.day);
    const endDate = new Date(period.endDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];

      const periodEvent = {
        day: formattedDate,
        eventType: 2,
        name: period.name,
        eventCategory: 2,
      };

      if (eventMap.has(formattedDate)) {
        eventMap.get(formattedDate).push(periodEvent);
      } else {
        eventMap.set(formattedDate, [periodEvent]);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return eventMap;
}

const YearCalendarScreen = function ({ navigation }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const flatListRef = useRef(null);
  const containerHeight =
    Dimensions.get("window").height - useSafeAreaInsets().top - 48 - 111;
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const [filter, setFilter] = useState(0);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);

  const sheetRef = useRef(null);

  const [appointments, setAppointments] = useState(new Map());
  const [loading, setLoading] = useState(true);

  const [keyboardHight, setKeyoardHight] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  useEffect(() => console.log(keyboardHight), [keyboardHight]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(firestoreDB, "appointments", user.uid);
      const singleEventsRef = collection(userDocRef, "singleEvents");
      const eventPeriodsRef = collection(userDocRef, "eventPeriods");

      const singleEventsSnapshot = await getDocs(singleEventsRef);
      const singleEvents = singleEventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        day: formatTimestamp(doc.data().day),
      }));

      const eventPeriodsSnapshot = await getDocs(eventPeriodsRef);
      const eventPeriods = eventPeriodsSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          day: formatTimestamp(doc.data().day),
          endDate: formatTimestamp(doc.data().endDate),
        };
      });

      setAppointments(createEventMap({ singleEvents, eventPeriods }));
    } catch (error) {
      console.error("Fehler beim Abrufen der Termine:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (
    name,
    day,
    endDate,
    eventType,
    description,
    singleEvent,
    saveAsDeadline
  ) => {
    if (!user) return;

    try {
      setLoading(true);

      const subcollectionName = singleEvent ? "singleEvents" : "eventPeriods";

      const userDocRef = doc(firestoreDB, "appointments", user.uid);
      const subcollectionRef = collection(userDocRef, subcollectionName);

      await addDoc(subcollectionRef, {
        name,
        day,
        ...(singleEvent ? {} : { endDate }),
        eventType,
        description,
        timestamp: serverTimestamp(),
      });

      console.log("Termin erfolgreich hinzugefügt!");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: e.message || "Ein Fehler ist aufgetreten",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
      fetchAppointments();
      eventType === 0 || saveAsDeadline
        ? addDeadline(name, day, description)
        : null;
    }
  };

  const addDeadline = async (name, day, description) => {
    if (!user) return;

    try {
      const deadlineCollectionRef = collection(
        firestoreDB,
        "deadlines",
        user.uid,
        "deadlinesList"
      );

      await addDoc(deadlineCollectionRef, {
        name,
        day,
        description,
        timestamp: serverTimestamp(),
      });

      console.log("Frist erfolgreich hinzugefügt!");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: e.message || "Ein Fehler ist aufgetreten",
        visibilityTime: 4000,
      });
    }
  };

  const toggleDropdown = useCallback(() => {
    const isOpening = !isFilterMenuVisible;

    width.value = withSpring(isOpening ? 250 : 50, {
      stiffness: 300,
      damping: 28,
    });

    height.value = withSpring(isOpening ? 150 : 0, {
      stiffness: 300,
      damping: 28,
    });

    opacity.value = withSpring(isOpening ? 1 : 0, {
      stiffness: 300,
      damping: 28,
    });

    setIsFilterMenuVisible(isOpening);
  }, [isFilterMenuVisible]);

  const animatedDropdownStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      opacity: interpolate(height.value, [0, 150], [0, 1]),
    };
  });

  const handleOpen = () => {
    sheetRef.current?.present();
  };

  const years = [currentYear, currentYear + 1];

  const renderItem = ({ item }) => (
    <View style={[styles.yearCalendarBox, { height: containerHeight }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerBox}>
          <Text
            style={[
              styles.headerTitleText,
              { color: item === currentYear ? "red" : "white" },
            ]}
          >
            {item}
          </Text>
        </View>
        <View style={styles.yearBox}>
          {[0, 1, 2, 3].map((index) => (
            <MonthRow
              key={index}
              rowIndex={index}
              year={item}
              filter={filter}
              eventMap={appointments}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
        <SafeAreaView style={styles.screen}>
          {isFilterMenuVisible && (
            <Pressable style={styles.overlay} onPress={toggleDropdown} />
          )}
          <View style={styles.containerYearCalendar}>
            <Pressable
              style={({ pressed }) => [
                styles.filterButton,
                { opacity: isFilterMenuVisible || pressed ? 0.6 : 1 },
              ]}
              activeOpacity={0.6}
              onPress={() => toggleDropdown()}
            >
              <Icon.MaterialIcons
                name={filter === 0 ? "filter-list-off" : "filter-list"}
                size={30}
                color="#333"
              />
            </Pressable>
            <Animated.View style={[styles.dropdown, animatedDropdownStyle]}>
              <BlurView tint="systemThinMaterialLight" intensity={200}>
                <TouchableOpacity
                  onPress={() => {
                    toggleDropdown();
                    setFilter(0);
                  }}
                  style={styles.filterSubButton}
                >
                  <Text style={styles.item}>keine Filter</Text>
                  <Icon.MaterialIcons
                    name="filter-list-off"
                    size={26}
                    color={"#333"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    toggleDropdown();
                    setFilter(1);
                  }}
                  style={styles.filterSubButton}
                >
                  <Text style={styles.item}>Ferien</Text>
                  <Icon.MaterialIcons
                    name="beach-access"
                    size={26}
                    color={"#333"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    toggleDropdown();
                    setFilter(2);
                  }}
                  style={styles.filterSubButton}
                >
                  <Text style={styles.item}>Termine</Text>
                  <Icon.MaterialIcons
                    name="calendar-month"
                    size={26}
                    color={"#333"}
                  />
                </TouchableOpacity>
              </BlurView>
            </Animated.View>

            <FlatList
              ref={flatListRef}
              data={years}
              index={-1}
              keyExtractor={(item) => item.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              style={{ borderRadius: 20 }}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleOpen}>
              <Icon.AntDesign name="pluscircle" size={40} color="#3a5f8a" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      <DeadlineBottomSheet
        sheetRef={sheetRef}
        addAppointment={addAppointment}
      />
    </View>
  );
};

export default memo(YearCalendarScreen);

const MonthRow = memo(({ rowIndex, year, filter, eventMap }) => {
  const navigation = useNavigation();
  const firstMonthIndex = rowIndex * 3;
  const calcFirstDayDate = (monthIndex) => {
    const adjustedYear = monthIndex < 2 ? year - 1 : year;
    const m = ((monthIndex + 10) % 12) + 1;

    const c = Math.floor(adjustedYear / 100);
    const y = adjustedYear % 100;

    const dayOfWeek =
      (1 +
        Math.floor(2.6 * m - 0.2) +
        y +
        Math.floor(y / 4) +
        Math.floor(c / 4) -
        2 * c) %
      7;

    return (dayOfWeek + 7) % 7;
  };

  return (
    <View style={styles.rowBox}>
      {[0, 1, 2].map((index) => (
        <MonthBox
          key={index}
          firstMonthDayWeekDay={calcFirstDayDate(firstMonthIndex + index)}
          month={firstMonthIndex + index}
          year={year}
          filter={filter}
          onPress={(distance, monthLength) =>
            navigation.navigate("YearDetailedScreen", {
              month: months[firstMonthIndex + index],
              date: `${year}-${firstMonthIndex + index + 1}-01`,
              distance: distance,
              monthLength: monthLength,
            })
          }
          eventMap={eventMap}
        />
      ))}
    </View>
  );
});

const MonthBox = memo(
  ({ firstMonthDayWeekDay, month, year, filter, onPress, eventMap }) => {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const monthLength = () => {
      if (month === 1) return isLeapYear ? 29 : 28;
      if (
        month === 0 ||
        month === 2 ||
        month === 4 ||
        month === 6 ||
        month === 7 ||
        month === 9 ||
        month === 11
      )
        return 31;
      return 30;
    };

    const secondWeekStartDay =
      firstMonthDayWeekDay !== 0 ? 8 - (firstMonthDayWeekDay - 1) : 2;

    const lastDayOfMonth = monthLength();

    const distance = firstMonthDayWeekDay !== 0 ? firstMonthDayWeekDay - 1 : 6;

    return (
      <TouchableOpacity
        style={styles.monthBox}
        onPress={() =>
          onPress(
            firstMonthDayWeekDay !== 0 ? firstMonthDayWeekDay - 1 : 6,
            lastDayOfMonth
          )
        }
      >
        <Text style={styles.monthTitle}>{months[month]}</Text>
        <View style={{ flex: 1 }}>
          {[...Array(6)].map((_, index) => (
            <DayRow
              key={index}
              id={index}
              distance={distance}
              endDay={lastDayOfMonth}
              month={month}
              year={year}
              filter={filter}
              eventMap={eventMap}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  }
);

const DayRow = memo(
  ({ id, distance, endDay, month, year, filter, eventMap }) => {
    const { holidayData } = useHolidayData();

    const startDay = id === 0 ? 1 : id * 7 - distance + 1;

    const days = Array.from({ length: 7 }, (_, i) => {
      const day =
        id === 0 ? (i >= distance ? i - distance + 1 : null) : startDay + i;
      return day > 0 && day <= endDay ? day : null;
    });

    const isToday = (d, m, y) => {
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return d === currentDay && m === currentMonth && y === currentYear;
    };

    const isHoliday = (day, month, year) => {
      const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
        day < 10 ? `0${day}` : day
      }`;
      return holidayData[0].data.has(date) || holidayData[1].data.has(date);
    };

    const isEvent = (day, month, year) => {
      const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
        day < 10 ? `0${day}` : day
      }`;
      if (eventMap.has(date)) {
        const events = eventMap.get(date);
        for (const event of events) {
          if (event.eventType === 1) return 1;
          else if (event.eventType === 0) return 0;
        }
        return 2;
      }
      return 0;
    };

    const getBorderRadius = (
      day,
      month,
      year,
      index,
      isHoliday,
      startDay,
      endDay,
      filter
    ) => {
      const isClasstest = isEvent(day, month, year) === 1;
      const isClasstestBefore = isEvent(day - 1, month, year) === 1;
      const isClasstestNext = isEvent(day + 1, month, year) === 1;

      const isEventStart =
        isEvent(day, month, year) === 2 &&
        (!isEvent(day - 1, month, year) ||
          isClasstestBefore ||
          day === startDay);

      const isEventEnd =
        isEvent(day, month, year) === 2 &&
        (!isEvent(day + 1, month, year) ||
          isClasstestNext ||
          index === 4 ||
          day === endDay);

      const isWeekendStart = index === 5 || (index === 6 && day === 1);
      const isWeekendEnd = index === 6 || (index === 5 && day === endDay);

      const isHolidayStart = (extraArgument) => {
        return (
          isHoliday(day, month, year) &&
          (!isHoliday(day - 1, month, year) ||
            extraArgument ||
            day === startDay)
        );
      };
      const isHolidayEnd = (extraArgument) => {
        return (
          (isHoliday(day, month, year) &&
            (!isHoliday(day + 1, month, year) ||
              extraArgument ||
              day === endDay)) ||
          index === 4
        );
      };

      if (filter === 0 || !filter || filter === null)
        return {
          borderTopLeftRadius:
            isClasstest && !isWeekendEnd
              ? 50
              : isWeekendStart ||
                (isHolidayStart(
                  isClasstestBefore ||
                    (isEvent(day, month, year) !== 2 &&
                      isEvent(day - 1, month, year) === 2)
                ) &&
                  index !== 6) ||
                (isEventStart && index !== 6)
              ? 50
              : 0,
          borderBottomLeftRadius:
            isClasstest && !isWeekendEnd
              ? 50
              : isWeekendStart ||
                (isHolidayStart(
                  isClasstestBefore ||
                    (isEvent(day, month, year) !== 2 &&
                      isEvent(day - 1, month, year) === 2)
                ) &&
                  index !== 6) ||
                (isEventStart && index !== 6)
              ? 50
              : 0,
          borderTopRightRadius:
            isClasstest && !isWeekendStart
              ? 50
              : isWeekendEnd ||
                (isHolidayEnd(
                  isClasstestNext ||
                    (isEvent(day, month, year) !== 2 &&
                      isEvent(day + 1, month, year) === 2)
                ) &&
                  index !== 5) ||
                (isEventEnd && index !== 5)
              ? 50
              : 0,
          borderBottomRightRadius:
            isClasstest && !isWeekendStart
              ? 50
              : isWeekendEnd ||
                (isHolidayEnd(
                  isClasstestNext ||
                    (isEvent(day, month, year) !== 2 &&
                      isEvent(day + 1, month, year) === 2)
                ) &&
                  index !== 5) ||
                (isEventEnd && index !== 5)
              ? 50
              : 0,
        };
      else if (filter === 1)
        return {
          borderTopLeftRadius: isWeekendStart || isHolidayStart() ? 50 : 0,
          borderBottomLeftRadius: isWeekendStart || isHolidayStart() ? 50 : 0,
          borderTopRightRadius:
            isWeekendEnd || (isHolidayEnd() && index !== 5) ? 50 : 0,
          borderBottomRightRadius:
            isWeekendEnd || (isHolidayEnd() && index !== 5) ? 50 : 0,
        };
      else if (filter === 2)
        return {
          borderTopLeftRadius:
            isClasstest && !isWeekendEnd
              ? 50
              : isWeekendStart || isEventStart
              ? 50
              : 0,
          borderBottomLeftRadius:
            isClasstest && !isWeekendEnd
              ? 50
              : isWeekendStart || isEventStart
              ? 50
              : 0,
          borderTopRightRadius:
            isClasstest && !isWeekendStart
              ? 50
              : isWeekendEnd || (isEventEnd && index !== 5)
              ? 50
              : 0,
          borderBottomRightRadius:
            isClasstest && !isWeekendStart
              ? 50
              : isWeekendEnd || (isEventEnd && index !== 5)
              ? 50
              : 0,
        };
    };
    const getDayColors = (
      day,
      month,
      year,
      index,
      isHoliday,
      startDay,
      endDay,
      filter
    ) => {
      if (filter === 0 || !filter || filter === null)
        return {
          backgroundColor:
            isEvent(day, month, year) !== 0
              ? isEvent(day, month, year) === 1
                ? "#F9D566"
                : "#C08CFF"
              : index === 5 || index === 6
              ? "#BFBFC4"
              : isHoliday(day, month, year)
              ? "#A4C8FF"
              : null,
        };
      else if (filter === 1)
        return {
          backgroundColor:
            index === 5 || index === 6
              ? "#BFBFC4"
              : isHoliday(day, month, year)
              ? "#A4C8FF"
              : null,
        };
      else if (filter === 2)
        return {
          backgroundColor:
            isEvent(day, month, year) !== 0
              ? isEvent(day, month, year) === 1
                ? "#F9D566"
                : "#C08CFF"
              : index === 5 || index === 6
              ? "#BFBFC4"
              : null,
        };
    };
    return (
      <View style={styles.dayRowBox}>
        {days.map((day, index) => {
          if (day > endDay || day < 1)
            return <View key={index} style={styles.dayBox} />;
          return (
            <View
              key={index}
              style={[
                styles.dayBox,
                {
                  ...getDayColors(
                    day,
                    month,
                    year,
                    index,
                    isHoliday,
                    startDay,
                    endDay,
                    filter
                  ),
                  ...getBorderRadius(
                    day,
                    month,
                    year,
                    index,
                    isHoliday,
                    startDay,
                    endDay,
                    filter
                  ),
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isToday(day, month, year) ? "red" : "#333",
                    fontSize: RFPercentage(1.41),
                    fontWeight: isToday(day, month, year) ? "700" : "600",
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 89,
  },
  containerYearCalendar: {
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
  yearCalendarBox: {
    flex: 1,
    padding: 8,
    paddingTop: 0,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBox: {
    height: "10%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  yearBox: {
    height: "85%",
    width: "100%",
    paddingHorizontal: 3,
    justifyContent: "space-between",
  },
  headerTitleText: {
    fontSize: RFPercentage(4),
    fontWeight: "900",
    color: "#ff3c00",
  },
  monthBox: {
    width: "33.333%",
    height: "100%",
    padding: 3,
  },
  rowBox: {
    width: "100%",
    height: "24.5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthTitle: {
    fontSize: RFPercentage(2.05),
    fontWeight: "600",
    color: "#333",
  },
  dayRowBox: {
    flexDirection: "row",
    width: "100%",
    height: "16.66%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayBox: {
    width: "14.285%",
    height: "95%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    right: -5,
    bottom: -5,
    zIndex: 1,
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  filterButton: {
    position: "absolute",
    right: -5,
    top: -5,
    zIndex: 2,
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: "#d1d1d1",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 10,
    borderRadius: 20,
    backgroundColor: "lightgray",
    elevation: 5,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: "hidden",
    zIndex: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  item: {
    padding: 15,
    fontWeight: "500",
    fontSize: RFPercentage(2.18),
  },
  filterSubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: "#333",
  },
});
