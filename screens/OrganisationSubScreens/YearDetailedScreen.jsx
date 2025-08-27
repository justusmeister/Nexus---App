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
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import { RFPercentage } from "react-native-responsive-fontsize";
import DeadlineBottomSheet from "../../components/BottomSheets/DeadlineBottomSheet/DeadlineBottomSheet";
import AppointmentModal from "../../modals/AppointmentModal";
import WeekRow from "../../components/YearDetailed/WeekRow";
import { EventListItem } from "../../components/YearDetailed/EventListItem";
import { formatSelectedDate } from "../../components/YearDetailed/utils/dateUtils";
import { useAppointments } from "../../hooks/useAppointments";
import PlusButton from "../../components/General/PlusButton";

const eventTypesList = ["Frist", "Klausur", "Event"];
const eventTypeColorList = ["#656565", "#F9D566", "#C08CFF"];

const YearDetailedScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAppointmentItem, setModalAppointmentItem] = useState(null);
  const { colors, fonts } = useTheme();

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;

  const {
    appointments,
    deadlinesList,
    loading,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments(user);

  useEffect(() => {
    fetchAppointments(params?.date, params?.monthLength);
    setSelectedDay(null);
  }, [params?.date, params?.monthLength, fetchAppointments]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params?.month,
      headerRight: () => <PlusButton onPress={handleOpen} small />,
    });
  }, [navigation, params]);

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  const handleSetSelectedDay = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  const formattedSelectedDate = formatSelectedDate(selectedDay, params?.date);

  const filteredDeadlines = formattedSelectedDate
    ? deadlinesList.filter(
        (item) =>
          item.day === formattedSelectedDate ||
          (item.day <= formattedSelectedDate &&
            item.endDate >= formattedSelectedDate)
      )
    : deadlinesList;

  const handleItemPress = useCallback((item) => {
    setModalAppointmentItem(item);
    setIsModalVisible(true);
  }, []);

  const handleAddAppointment = useCallback(
    (
      name,
      day,
      endDate,
      eventType,
      description,
      singleEvent,
      saveAsDeadline
    ) => {
      addAppointment(
        name,
        day,
        endDate,
        eventType,
        description,
        singleEvent,
        saveAsDeadline
      )
        .then((result) => {
          if (result?.success)
            fetchAppointments(params?.date, params?.monthLength);
        })
        .catch((e) => console.error("Fehler:", e));
    },
    [addAppointment]
  );

  const handleDeleteAppointment = useCallback(
    (singleEvent, itemId) => {
      deleteAppointment(singleEvent, itemId)
        .then((result) => {
          if (result?.success) {
            fetchAppointments(params?.date, params?.monthLength);
          } else console.log(result);
        })
        .catch((e) => console.error("Fehler:", e));

      setIsModalVisible(false);
    },
    [deleteAppointment]
  );

  const handleUpdateAppointment = useCallback(
    (title, description, dueDate, endDate, eventCategory, itemId) => {
      updateAppointment(
        title,
        description,
        dueDate,
        endDate,
        eventCategory,
        itemId
      )
        .then((result) => {
          if (result?.success)
            fetchAppointments(params?.date, params?.monthLength);
        })
        .catch((e) => console.error("Fehler:", e));
    },
    [updateAppointment]
  );

  function getSelectedDate(baseDateStr, selectedDay) {
  const baseDate = new Date(baseDateStr);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const today = new Date();
  const isSameMonthAndYear =
    today.getFullYear() === year && today.getMonth() === month;

  // Tag validieren: Muss Zahl zwischen 1 und 31 sein
  const parsedDay = parseInt(selectedDay, 10);
  const isValidDay =
    !isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 31;

  if (isValidDay) {
    return new Date(year, month, parsedDay);
  } else {
    return isSameMonthAndYear ? null : baseDate;
  }
}


  return (
    <View style={[styles.screen, { backgroundColor: colors.background, 
      borderTopColor: colors.border,
      borderTopWidth: StyleSheet.hairlineWidth }]}>
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
          style={[styles.deadlineListView, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.semibold }]}>
            Termine {selectedDay ? `am ${selectedDay}.` : "im ganzen"}{" "}
            {params?.month}:
          </Text>

          <FlashList
            data={filteredDeadlines}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventListItem
                item={item}
                eventTypeColorList={eventTypeColorList}
                eventTypesList={eventTypesList}
                onPress={() => handleItemPress(item)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: tabBarHeight + 6, 
            }}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator size={"small"} color={colors.text} />
              ) : (
                <Text style={styles.emptyListText}>
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
        selectedDay={getSelectedDate(params?.date, selectedDay)}
        addAppointment={handleAddAppointment}
      />
      <AppointmentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        item={modalAppointmentItem}
        onDelete={handleDeleteAppointment}
        onUpdate={handleUpdateAppointment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    fontSize: RFPercentage(2.44),
    fontWeight: "600",
    padding: 10,
    marginLeft: 10,
  },
  emptyListText: {
    width: "100%",
    textAlign: "center",
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#8E8E93",
  },
});

export default memo(YearDetailedScreen);
