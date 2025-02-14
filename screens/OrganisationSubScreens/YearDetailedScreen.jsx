import {
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
  useEffect,
  memo,
} from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useHolidayData } from "../../contexts/HolidayDataContext";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  Timestamp,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import DeadlineBottomSheet from "../../components/DeadlineBottomSheet";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";

const eventTypesList = ["Frist", "Klausur", "Event"];
const eventTypeColorList = ["#656565", "#F9D566", "#C08CFF"];

function createEventMap(events) {
  const eventMap = new Map();

  events.singleEvents.forEach((event) => {
    const singleEvent = {
      date: event.day,
      eventType: event.eventType,
      title: event.title,
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
        date: formattedDate,
        eventType: 2,
        name: period.title,
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

const YearDetailedScreen = function ({ navigation }) {
  const [appointments, setAppointments] = useState(new Map());
  const [deadlinesList, setDeadlinesList] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const parseDateToTimestamp = (dateString) => {
    const date = new Date(dateString);
    return Timestamp.fromDate(date);
  };

  const parseDateToTimestampRange = (startDate, endDate) => ({
    start: parseDateToTimestamp(startDate),
    end: parseDateToTimestamp(endDate),
  });

  const fetchAppointments = async (startDate) => {
    if (!user) return;

    try {
      const userDocRef = doc(firestoreDB, "appointments", user.uid);
      const singleEventsRef = collection(userDocRef, "singleEvents");
      const eventPeriodsRef = collection(userDocRef, "eventPeriods");

      const { start, end } = parseDateToTimestampRange(
        startDate,
        `${new Date(startDate).getFullYear()}-${
          new Date(startDate).getMonth() + 1
        }-${params.monthLength}`
      );

      const singleEventsQuery = query(
        singleEventsRef,
        where("day", ">=", start),
        where("day", "<=", end),
        orderBy("day")
      );
      const singleEventsSnapshot = await getDocs(singleEventsQuery);
      const singleEvents = singleEventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        day: formatTimestamp(doc.data().day),
      }));

      const eventPeriodsQuery = query(
        eventPeriodsRef,
        where("day", ">=", start),
        where("day", "<=", end),
        orderBy("day")
      );
      const eventPeriodsSnapshot = await getDocs(eventPeriodsQuery);
      const eventPeriods = eventPeriodsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        title: doc.name,
        day: formatTimestamp(doc.data().day),
        endDate: formatTimestamp(doc.data().endDate),
      }));

      setAppointments(createEventMap({ singleEvents, eventPeriods }));
      setDeadlinesList([...singleEvents, ...eventPeriods]);
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
      fetchAppointments(params.date);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params?.month,
      headerRight: () => (
        <TouchableOpacity style={styles.addButton} onPress={handleOpen}>
          <Icon.AntDesign name="pluscircle" size={35} color="#3a5f8a" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, params]);

  useEffect(() => {
    fetchAppointments(params?.date);
    setSelectedDay(null);
  }, [params]);

  const sheetRef = useRef(null);

  const handleOpen = () => {
    sheetRef.current?.present();
  };

  const handleSetSelectedDay = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  const formatDate = () => {
    if (!selectedDay || !params?.date) return null;

    const [year, month] = params?.date.split("-");
    const formattedDay = String(selectedDay).padStart(2, "0");
    return `${year}-${month.padStart(2, "0")}-${formattedDay}`;
  };

  const filteredDeadlines = formatDate()
    ? deadlinesList.filter((item) => item.day === formatDate())
    : deadlinesList;

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.monthOverviewContainer}>
          {[...Array(6)].map((_, i) => (
            <WeekRow
              key={i}
              id={i}
              monthLength={params?.monthLength}
              firstDayDistance={params?.distance}
              date={params?.date}
              eventMap={appointments}
              selectedDay={selectedDay}
              setSelectedDay={handleSetSelectedDay}
            />
          ))}
        </View>
        <View style={styles.deadlineListView}>
          <Text style={styles.sectionTitle}>
            Fristen {selectedDay ? `zum ${selectedDay}.` : "im ganzen"} {params?.month}:
          </Text>

          <FlashList
            data={filteredDeadlines}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.deadlineItem,
                  { borderColor: eventTypeColorList[item.eventType] },
                ]}
              >
                <View style={styles.deadlineContent}>
                  <Text style={styles.deadlineTitle}>{item.name}</Text>
                  <Text style={styles.deadlineCategory}>
                    {eventTypesList[item.eventType]}
                  </Text>
                </View>
                <Text style={styles.deadlineDate}>
                  {new Date(item.day).toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator size={"small"} color={"#333"} />
              ) : (
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    fontWeight: "500",
                    color: "#8E8E93",
                  }}
                >
                  Keine Fristen an diesem Tag
                </Text>
              )
            }
            estimatedItemSize={75}
          />
        </View>
      </View>
      <DeadlineBottomSheet
        sheetRef={sheetRef}
        addAppointment={addAppointment}
      />
    </View>
  );
};

export default memo(YearDetailedScreen);

const WeekRow = memo(
  ({
    id,
    monthLength,
    firstDayDistance,
    date,
    eventMap,
    selectedDay,
    setSelectedDay,
  }) => {
    const { holidayData } = useHolidayData();

    const startDay = id === 0 ? 1 : id * 7 - firstDayDistance + 1;
    let lastRow = false;

    const days = Array.from({ length: 7 }, (_, i) => {
      const day =
        id === 0
          ? i >= firstDayDistance
            ? i - firstDayDistance + 1
            : null
          : startDay + i;
      if (day === monthLength) lastRow = true;
      return day > 0 && day <= monthLength ? day : null;
    });

    if (startDay > monthLength) return null;

    const month = new Date(date).getMonth();

    const year = new Date(date).getFullYear();

    const isToday = (d, m, y) => {
      if (d === null) return false;
      const today = new Date();
      return (
        d === today.getDate() &&
        m === today.getMonth() &&
        y === today.getFullYear()
      );
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

    const isDeadline = (day, month, year) => {
      const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
        day < 10 ? `0${day}` : day
      }`;
      if (eventMap.has(date)) {
        const events = eventMap.get(date);
        for (const event of events) {
          if (event.eventType === 0) return 0;
        }
        return 1;
      }
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
      <View style={[styles.weekRow, { borderBottomWidth: lastRow ? 0 : 0.5 }]}>
        {days.map((day, index) => {
          if (day > monthLength || day < 1)
            return <View key={index} style={styles.dayButton} />;
          return (
            <View
              style={[
                styles.dayButton,
                getDayColors(
                  day,
                  month,
                  year,
                  index,
                  isHoliday,
                  startDay,
                  monthLength,
                  0
                ),
                getBorderRadius(
                  day,
                  month,
                  year,
                  index,
                  isHoliday,
                  startDay,
                  monthLength,
                  0
                ),
              ]}
              key={index}
            >
              <TouchableOpacity
                style={{
                  width: "95%",
                  alignItems: "center",
                  borderRadius: 50,
                  backgroundColor: selectedDay === day ? "white" : null,
                }}
                onPress={() =>
                  day !== selectedDay
                    ? setSelectedDay(day)
                    : setSelectedDay(null)
                }
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isToday(day, month, year) ? "red" : "black",
                    },
                  ]}
                >
                  {day}
                </Text>
                <Icon.FontAwesome
                  name="circle"
                  size={6}
                  color={"#656565"}
                  style={{
                    margin: 2,
                    opacity: isDeadline(day, month, year) === 0 ? 1 : 0,
                  }}
                />
              </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#a1a1a1",
  },
  monthOverviewContainer: {
    flex: 1,
    justifyContent: "center",
  },
  deadlineListView: {
    height: "50%",
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#EFEEF6",
    paddingBottom: 89,
  },
  sheetContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 79,
  },
  weekRow: {
    height: `${100 / 6}%`,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E0E0E0",
  },
  dayButton: {
    width: `${100 / 7}%`,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: RFPercentage(2.44),
    fontWeight: "600",
    borderRadius: 50,
    padding: 7,
    paddingHorizontal: 12,
  },
  deadlineItem: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: "4",
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
    color: "#333",
  },
  deadlineCategory: {
    fontSize: RFPercentage(1.92),
    color: "#777",
  },
  deadlineDate: {
    fontSize: RFPercentage(1.92),
    fontWeight: "500",
    color: "#333",
  },
  sectionTitle: {
    fontSize: RFPercentage(2.44),
    fontWeight: "600",
    padding: 10,
    marginLeft: 10,
  },
});
