import {
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
  useEffect,
  memo,
  useMemo,
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
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import DeadlineBottomSheet from "../../components/BottomSheets/DeadlineBottomSheet/DeadlineBottomSheet";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AppointmentModal from "../../modals/AppointmentModal";
import { eventEmitter } from "../../eventBus";
import WeekRow from "../../components/YearDetailed/WeekRow";

const eventTypesList = ["Frist", "Klausur", "Event"];
const eventTypeColorList = ["#656565", "#F9D566", "#C08CFF"];

function createEventMap(events) {
  const eventMap = new Map();

  events.singleEvents.forEach((event) => {
    const singleEvent = {
      day: event.day,
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
        day: period.day,
        date: formattedDate,
        endDate: period.endDate,
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
  const tabBarHeight = useBottomTabBarHeight();
  const [appointments, setAppointments] = useState(new Map());
  const [deadlinesList, setDeadlinesList] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAppointmentItem, setModalAppointmentItem] = useState(null);

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

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

  const fetchAppointments = useCallback(
    async (startDate) => {
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
          eventCategory: 1,
        }));

        const eventPeriodsQuery1 = query(
          eventPeriodsRef,
          where("day", ">=", start),
          where("day", "<=", end),
          orderBy("day")
        );

        const eventPeriodsQuery2 = query(
          eventPeriodsRef,
          where("endDate", ">=", start),
          where("endDate", "<=", end)
        );

        const [eventPeriodsSnapshot1, eventPeriodsSnapshot2] =
          await Promise.all([
            getDocs(eventPeriodsQuery1),
            getDocs(eventPeriodsQuery2),
          ]);

        const eventPeriods = [
          ...eventPeriodsSnapshot1.docs,
          ...eventPeriodsSnapshot2.docs,
        ]
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            title: doc.name,
            date: doc.day,
            day: formatTimestamp(doc.data().day),
            endDate: formatTimestamp(doc.data().endDate),
            eventCategory: 2,
          }))
          .filter(
            (event, index, self) =>
              index === self.findIndex((e) => e.id === event.id) // Duplikate rausfiltern
          );

        setAppointments(createEventMap({ singleEvents, eventPeriods }));
        setDeadlinesList([...singleEvents, ...eventPeriods]);
      } catch (error) {
        console.error("Fehler beim Abrufen der Termine:", error);
      } finally {
        setLoading(false);
      }
    },
    [user, params.monthLength]
  );

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
      eventEmitter.emit("refreshAppointments");
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
    } finally {
      eventEmitter.emit("refreshDeadlines");
    }
  };

  const deleteAppointment = async (singleEvent, itemId) => {
    if (!user) return;

    try {
      const userDocRef = doc(firestoreDB, "appointments", user.uid);

      if (singleEvent) {
        const singleEventRef = doc(userDocRef, "singleEvents", itemId);
        await deleteDoc(singleEventRef);
      } else {
        const eventPeriodsRef = doc(userDocRef, "eventPeriods", itemId);
        await deleteDoc(eventPeriodsRef);
      }

      console.log("Termin erfolgreich gelöscht!");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: e.message || "Ein Fehler ist aufgetreten",
        visibilityTime: 4000,
      });
    } finally {
      setIsModalVisible(false);
      fetchAppointments(params.date);
      eventEmitter.emit("refreshAppointments");
    }
  };

  const updateAppointment = async (
    title,
    description,
    dueDate,
    endDate,
    eventCategory,
    itemId
  ) => {
    if (user) {
      try {
        const userAppointmentsRef = doc(firestoreDB, "appointments", user.uid);
        let appointmentDocRef;
        if (eventCategory === 1)
          appointmentDocRef = doc(userAppointmentsRef, "singleEvents", itemId);
        else
          appointmentDocRef = doc(userAppointmentsRef, "eventPeriods", itemId);

        await setDoc(
          appointmentDocRef,
          {
            name: title,
            description: description,
            day: dueDate,
            endDate: eventCategory === 2 ? endDate : null,
            timestamp: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: e.message || "Unbekannter Fehler",
          visibilityTime: 4000,
        });
      } finally {
        fetchAppointments(params.date);
      }
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
  }, [params.date]);

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
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
    ? deadlinesList.filter(
        (item) =>
          item.day === formatDate() ||
          (item.day <= formatDate() && item.endDate >= formatDate())
      )
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
        <View
          style={[styles.deadlineListView, { paddingBottom: tabBarHeight + 6 }]}
        >
          <Text style={styles.sectionTitle}>
            Fristen {selectedDay ? `zum ${selectedDay}.` : "im ganzen"}{" "}
            {params?.month}:
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
                onPress={() => {
                  setModalAppointmentItem(item);
                  setIsModalVisible(true);
                }}
              >
                <View style={styles.deadlineContent}>
                  <Text
                    style={styles.deadlineTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
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
                  {selectedDay
                    ? "Keine Termine an diesem Tag"
                    : "Keine Termine in diesem Monat"}
                </Text>
              )
            }
            estimatedItemSize={75}
          />
        </View>
      </View>
      <DeadlineBottomSheet
        sheetRef={sheetRef}
        titleInputRef={titleInputRef}
        addAppointment={addAppointment}
      />
      <AppointmentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        item={modalAppointmentItem}
        onDelete={deleteAppointment}
        onUpdate={updateAppointment}
      />
    </View>
  );
};

export default memo(YearDetailedScreen);

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
