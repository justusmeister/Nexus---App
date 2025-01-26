import { useState, useEffect, useRef, useCallback } from "react";
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
} from "react-native";
import { useHolidayData } from "../../contexts/HolidayDataContext";
import * as Icon from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { SegmentedControl } from "../../components/SegmentedControl";
import DateTimePicker from "@react-native-community/datetimepicker";

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

const dummyEvents = {
  singleEvents: [
    {
      day: "2025-02-06",
      eventType: 1,
      name: "Deutscharbeit",
    },
    {
      day: "2025-03-12",
      eventType: 1,
      name: "Matheklausur",
    },
    {
      day: "2025-04-10",
      eventType: 1,
      name: "Englischprüfung",
    },
    {
      day: "2025-05-22",
      eventType: 0,
      name: "Konzert der Schulband",
    },
    {
      day: "2025-06-15",
      eventType: 0,
      name: "Schulfest",
    },
  ],
  eventPeriods: [
    {
      startDay: "2025-03-08",
      endDay: "2025-03-15",
      name: "Projektwoche",
    },
    {
      startDay: "2025-05-01",
      endDay: "2025-05-05",
      name: "Praktikum",
    },
    {
      startDay: "2025-07-15",
      endDay: "2025-07-23",
      name: "Praktikum",
    },
  ],
};

function createEventMap(dummyEvents) {
  const eventMap = new Map();

  dummyEvents.singleEvents.forEach((event) => {
    const singleEvent = {
      day: event.day,
      eventType: 1,
      name: event.name,
      eventCategory: 1,
    };

    if (eventMap.has(event.day)) {
      eventMap.get(event.day).push(singleEvent);
    } else {
      eventMap.set(event.day, [singleEvent]);
    }
  });

  dummyEvents.eventPeriods.forEach((period) => {
    let currentDate = new Date(period.startDay);
    const endDate = new Date(period.endDay);

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

const eventMap = createEventMap(dummyEvents);

const YearCalendarScreen = function ({ navigation }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const flatListRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const [filter, setFilter] = useState(0);
  const [selectedOption, setSelectedOption] = useState("Event");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);
  const containerRef = useRef(null);
  const sheetRef = useRef(null);

  const toggleDropdown = () => {
    if (!isFilterMenuVisible) {
      width.value = withTiming(250, { duration: 170 });
      height.value = withTiming(150, { duration: 170 });
      opacity.value = withTiming(1);
    } else {
      width.value = withTiming(50, { duration: 170 });
      height.value = withTiming(0, { duration: 170 });
      opacity.value = withTiming(0);
    }
    setIsFilterMenuVisible((prev) => !prev);
  };

  const animatedDropdownStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      opacity: interpolate(height.value, [0, 150], [0, 1]),
    };
  });

  const snapPoints = ["95%"];

  const handleOpen = () => {
    sheetRef.current?.snapToIndex(0);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    sheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const years = [
    new Date().getMonth() < 4 ? currentYear - 1 : currentYear,
    new Date().getMonth() < 4 ? currentYear : currentYear + 1,
    new Date().getMonth() < 4 ? currentYear + 1 : currentYear + 2,
  ];

  useEffect(() => {
    containerRef.current?.measure((_, __, ___, height) =>
      setContainerHeight(height)
    );
  }, []);

  useEffect(() => {
    if (containerHeight > 0) {
      const currentIndex = new Date().getMonth() < 4 ? 1 : 0;
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [containerHeight]);

  const getItemLayout = (data, index) => ({
    length: containerHeight,
    offset: containerHeight * index,
    index,
  });

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
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
        <SafeAreaView style={styles.screen}>
          {isFilterMenuVisible && (
            <Pressable style={styles.overlay} onPress={toggleDropdown} />
          )}
          <View ref={containerRef} style={styles.containerYearCalendar}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { opacity: isFilterMenuVisible ? 0.6 : 1 },
              ]}
              activeOpacity={0.4}
              onPress={() => toggleDropdown()}
            >
              <Icon.MaterialIcons
                name={filter === 0 ? "filter-list-off" : "filter-list"}
                size={30}
                color="#333"
              />
            </TouchableOpacity>
            <Animated.View style={[styles.dropdown, animatedDropdownStyle]}>
              <TouchableOpacity
                onPress={() => {
                  toggleDropdown();
                  setFilter(0);
                }}
              >
                <Text style={styles.item}>keine Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleDropdown();
                  setFilter(1);
                }}
              >
                <Text style={styles.item}>Ferien</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleDropdown();
                  setFilter(2);
                }}
              >
                <Text style={styles.item}>Termine</Text>
              </TouchableOpacity>
            </Animated.View>

            <FlatList
              ref={flatListRef}
              data={years}
              index={-1}
              keyExtractor={(item) => item.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              getItemLayout={getItemLayout}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleOpen}>
              <Icon.AntDesign name="pluscircle" size={40} color="#3a5f8a" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.sheetContainer}
          keyboardShouldPersistTaps="handled"
          onScroll={() => Keyboard.dismiss()}
        >
          <SegmentedControl
            options={["Zeitraum", "Event", "Frist"]}
            selectedOption={selectedOption}
            onOptionPress={setSelectedOption}
            style={styles.segmentedControl}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name des Faches/Events:</Text>
            <BottomSheetTextInput
              style={styles.inputField}
              placeholder="Name des Faches/Events"
            />
          </View>

          {selectedOption !== "Zeitraum" && (
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Ganztägig:</Text>
              <Switch value={isAllDay} onValueChange={setIsAllDay} />
            </View>
          )}

          <View style={styles.dateTimeContainer}>
            <Text style={styles.label}>Startdatum:</Text>
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, date) => date && setStartDate(date)}
            />
          </View>

          {!isAllDay && (
            <View style={styles.dateTimeContainer}>
              <Text style={styles.label}>Startzeit:</Text>
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={(event, date) => date && setStartDate(date)}
              />
            </View>
          )}

          <View style={styles.dateTimeContainer}>
            <Text style={styles.label}>Enddatum:</Text>
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, date) => date && setEndDate(date)}
            />
          </View>

          {!isAllDay && selectedOption === "normale Frist" && (
            <View style={styles.dateTimeContainer}>
              <Text style={styles.label}>Endzeit:</Text>
              <DateTimePicker
                value={endDate}
                mode="time"
                display="default"
                onChange={(event, date) => date && setEndDate(date)}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Beschreibung (optional):</Text>
            <TextInput
              style={styles.descriptionField}
              placeholder="Beschreibung hinzufügen..."
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <Pressable style={styles.confirmButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Speichern</Text>
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default YearCalendarScreen;

const MonthRow = ({ rowIndex, year, filter }) => {
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
          onPress={() =>
            navigation.navigate("YearDetailedScreen", {
              month: months[firstMonthIndex + index],
            })
          }
        />
      ))}
    </View>
  );
};

const MonthBox = ({ firstMonthDayWeekDay, month, year, filter, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.monthBox} onPress={onPress}>
      <Text style={styles.monthTitle}>{months[month]}</Text>
      <View style={{ flex: 1 }}>
        <DayRow
          distance={firstMonthDayWeekDay !== 0 ? firstMonthDayWeekDay - 1 : 6}
          startDay={1}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
          filter={filter}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
          filter={filter}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 7}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
          filter={filter}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 14}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
          filter={filter}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 21}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
          filter={filter}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 28}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
          filter={filter}
        />
      </View>
    </TouchableOpacity>
  );
};

const DayRow = ({ distance, startDay, endDay, month, year, filter }) => {
  const { holidayData } = useHolidayData();

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
      }
      return 2;
    } else return 0;
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
      (!isEvent(day - 1, month, year) || isClasstestBefore || day === startDay);

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
        (!isHoliday(day - 1, month, year) || extraArgument || day === startDay)
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
              isHolidayStart(
                isClasstestBefore ||
                  (isEvent(day, month, year) !== 2 &&
                    isEvent(day - 1, month, year) === 2)
              ) ||
              isEventStart
            ? 50
            : 0,
        borderBottomLeftRadius:
          isClasstest && !isWeekendEnd
            ? 50
            : isWeekendStart ||
              isHolidayStart(
                isClasstestBefore ||
                  (isEvent(day, month, year) !== 2 &&
                    isEvent(day - 1, month, year) === 2)
              ) ||
              isEventStart
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
              ? "#fcd968"
              : "#9f65f0"
            : index === 5 || index === 6
            ? "#c4c4c4"
            : isHoliday(day, month, year)
            ? "#b4d3ed"
            : null,
      };
    else if (filter === 1)
      return {
        backgroundColor:
          index === 5 || index === 6
            ? "#c4c4c4"
            : isHoliday(day, month, year)
            ? "#b4d3ed"
            : null,
      };
    else if (filter === 2)
      return {
        backgroundColor:
          isEvent(day, month, year) !== 0
            ? isEvent(day, month, year) === 1
              ? "#fcd968"
              : "#9f65f0"
            : index === 5 || index === 6
            ? "#c4c4c4"
            : null,
      };
  };
  return (
    <View style={styles.dayRowBox}>
      {Array.from({ length: 7 }).map((_, index) => {
        const day = startDay - distance + index;
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
                  fontSize: isToday(day, month, year) ? 11 : 10,
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
};

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
    fontSize: 32,
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
    fontSize: 15,
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
    backgroundColor: "#ffffff",
    borderRadius: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontSize: 16,
  },
  sheetContainer: {
    paddingBottom: 79,
    padding: 16,
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  segmentedControl: {
    marginBottom: 20,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: 16,
  },
  descriptionField: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  switchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateTimeContainer: {
    width: "100%",
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
