import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  InteractionManager,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useHolidayData } from "../contexts/HolidayDataContext";

const dummyStundenplan = [
  {
    tag: "Montag",
    stunden: [
      {
        fach: "Mathe",
        lehrer: "ABC",
        raum: "101",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Deutsch",
        lehrer: "DEF",
        raum: "102",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Englisch",
        lehrer: "GHI",
        raum: "103",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Chemie",
        lehrer: "JKL",
        raum: "104",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Sport",
        lehrer: "MNO",
        raum: "DSH-1",
        vertretung: { lehrer: "PQR", raum: "DSH-1" },
        entfall: false,
      },
      {
        fach: "Geschichte",
        lehrer: "STU",
        raum: "105",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
    ],
  },
  {
    tag: "Dienstag",
    stunden: [
      {
        fach: "Mathe",
        lehrer: "ABC",
        raum: "101",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Informatik",
        lehrer: "VWX",
        raum: "106",
        vertretung: { lehrer: null, raum: null },
        entfall: true,
      },
      {
        fach: "Biologie",
        lehrer: "YZA",
        raum: "107",
        vertretung: { lehrer: "BCD", raum: "107" },
        entfall: false,
      },
      {
        fach: "Englisch",
        lehrer: "GHI",
        raum: "103",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Kunst",
        lehrer: "EFG",
        raum: "109",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Musik",
        lehrer: "HIJ",
        raum: "110",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Erdkunde",
        lehrer: "KLM",
        raum: "111",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
    ],
  },
  {
    tag: "Mittwoch",
    stunden: [
      {
        fach: "Geschichte",
        lehrer: "STU",
        raum: "105",
        vertretung: { lehrer: "NOP", raum: "105" },
        entfall: false,
      },
      {
        fach: "Physik",
        lehrer: "QRS",
        raum: "113",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Chemie",
        lehrer: "JKL",
        raum: "104",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Mathe",
        lehrer: "ABC",
        raum: "101",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Deutsch",
        lehrer: "DEF",
        raum: "102",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Sport",
        lehrer: "MNO",
        raum: "DSH-1",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Ethik",
        lehrer: "TUV",
        raum: "114",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Englisch",
        lehrer: "GHI",
        raum: "103",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
    ],
  },
  {
    tag: "Donnerstag",
    stunden: [
      {
        fach: "Mathe",
        lehrer: "ABC",
        raum: "101",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Informatik",
        lehrer: "VWX",
        raum: "106",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Biologie",
        lehrer: "YZA",
        raum: "107",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Englisch",
        lehrer: "GHI",
        raum: "103",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Chemie",
        lehrer: "JKL",
        raum: "104",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Geschichte",
        lehrer: "STU",
        raum: "105",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
    ],
  },
  {
    tag: "Freitag",
    stunden: [
      {
        fach: "Erdkunde",
        lehrer: "KLM",
        raum: "111",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Physik",
        lehrer: "QRS",
        raum: "113",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Kunst",
        lehrer: "EFG",
        raum: "109",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Deutsch",
        lehrer: "DEF",
        raum: "102",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Musik",
        lehrer: "HIJ",
        raum: "110",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Sport",
        lehrer: "MNO",
        raum: "DSH-1",
        vertretung: { lehrer: null, raum: null },
        entfall: false,
      },
      {
        fach: "Mathe",
        lehrer: "ABC",
        raum: "101",
        vertretung: { lehrer: "OPQ", raum: "101" },
        entfall: false,
      },
    ],
  },
];

const lessonStartTime = [
  "07:50",
  "08:35",
  "09:40",
  "10:25",
  "11:30",
  "12:15",
  "13:15",
  "14:00",
  "14:55",
  "15:40",
];

const monthList = [
  "Jan.",
  "Feb.",
  "Mär.",
  "Apr.",
  "Mai",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Okt.",
  "Nov.",
  "Dez.",
  null,
];

function addTime(timeString, minutesToAdd) {
  const time = new Date(`2024-12-10T${timeString}:00`);
  time.setMinutes(time.getMinutes() + minutesToAdd);
  return time.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const screenWidth = Dimensions.get("window").width - 44;

const { height: screenHeight } = Dimensions.get("window");
const cellHeight = screenHeight * 0.0635;

const setDayDate = (date, daysAmount) => {
  newDate = new Date(date);
  newDate.setDate(newDate.getDate() + daysAmount);
  return newDate;
};

const convertToISOTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Column = ({ data, indexColumn, currentWeekMonday, onPressLessonBox }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLessonData, setCurrentLessonData] = useState();
  const { holidayData } = useHolidayData();

  const emptyCells = Array.from(
    { length: 10 - data.length },
    (_, index) => index
  );

  const isHoliday = (day) =>
    holidayData[0].data.has(day) || holidayData[1].data.has(day);

  const columnDay = convertToISOTime(
    setDayDate(currentWeekMonday, indexColumn)
  );

  const holidayName =
    holidayData[1].data.get(columnDay)?.name ||
    holidayData[0].data.get(columnDay)?.name ||
    "";

  return (
    <View
      style={[styles.column, { borderRightWidth: indexColumn !== 4 ? 1 : 0 }]}
    >
      {isHoliday(columnDay) ? (
        <View
          style={{
            height: cellHeight * 10,
            backgroundColor: "#3a5f8a",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {holidayName.split("").map((char, index) => (
            <Text
              key={index}
              style={{ fontSize: 15, fontWeight: "500", color: "white" }}
            >
              {char}
            </Text>
          ))}
        </View>
      ) : (
        data.map((item, index) => (
          <View key={index} style={[styles.cell, { height: cellHeight }]}>
            <Pressable
              style={styles.lessonBox}
              onPress={() => {
                setCurrentLessonData(data[index]);
                setIsModalVisible(true);
              }}
            >
              <Text style={styles.lessonText}>{data[index]?.fach}</Text>
              <Text style={styles.lessonText}>{data[index]?.raum}</Text>
              <Text style={styles.lessonText}>{data[index]?.lehrer}</Text>
            </Pressable>
          </View>
        ))
      )}
      {!isHoliday(columnDay) && data.length < 10
        ? emptyCells.map((item, index) => (
            <View
              key={index}
              style={[
                styles.cell,
                {
                  height: cellHeight,
                  borderBottomWidth: index === emptyCells.length - 1 ? 0 : 1,
                },
              ]}
            ></View>
          ))
        : null}
      <LessonInfoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={currentLessonData}
      />
    </View>
  );
};

const TimeColumn = ({ content }) => {
  return (
    <View style={styles.timeColumn}>
      {content.map((item, index) => (
        <View
          key={index}
          style={[
            styles.cell,
            {
              height: cellHeight,
              borderBottomWidth: index === content.length - 1 ? 0 : 1,
            },
          ]}
        >
          <Text style={styles.timeText}>{lessonStartTime[index]}</Text>
          <Text style={styles.lessonNumber}>{index + 1}</Text>
          <Text style={styles.timeText}>
            {addTime(lessonStartTime[index], 45)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const createWeekDate = (currentWeek) => {
  return new Date(new Date().setDate(new Date().getDate() + 7 * currentWeek));
};

const TimeTable = ({ currentWeek }) => {
  const [currentDate, setCurrentDate] = useState(createWeekDate(currentWeek));
  useEffect(() => {
    const updateCurrentTime = () => {
      InteractionManager.runAfterInteractions(() => {
        setCurrentDate(createWeekDate(currentWeek));
      });
    };
    const timer = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(timer);
  }, []);

  let monthAlreadyDisplayed = false;

  const distanceToCurrentWeekMonday = (currentDate.getDay() + 6) % 7;
  let currentWeekMonday = new Date(currentDate);
  currentWeekMonday.setDate(
    currentWeekMonday.getDate() - distanceToCurrentWeekMonday
  );

  const checkDateMonth = (mondayDate, dayDate) => {
    if (mondayDate.getMonth() === dayDate.getMonth()) {
      return 12;
    } else {
      if (!monthAlreadyDisplayed) {
        monthAlreadyDisplayed = true;
        return dayDate.getMonth();
      } else return 12;
    }
  };

  return (
    <View style={styles.container}>
      {currentWeek === 0 ? (
        <Icon.FontAwesome
          name="circle"
          size={13}
          color={"#d17002"}
          style={{ position: "absolute", top: 15, left: 15 }}
        />
      ) : null}
      <View style={styles.daysInfoBox}>
        {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(
          (day, index) => (
            <View
              key={index}
              style={[
                styles.daysInfo,
                {
                  backgroundColor:
                    currentWeek === 0 && index + 1 === currentDate.getDay()
                      ? "#7d7d7d"
                      : null,
                },
              ]}
            >
              <Text style={{ fontSize: 8, fontWeight: "500" }}>
                {index === 0
                  ? monthList[currentWeekMonday.getMonth()]
                  : monthList[
                      checkDateMonth(
                        currentWeekMonday,
                        setDayDate(currentWeekMonday, index)
                      )
                    ]}
              </Text>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight:
                    currentWeek === 0 && index + 1 === currentDate.getDay()
                      ? "900"
                      : "600",
                }}
              >
                {index === 0
                  ? currentWeekMonday.getDate()
                  : setDayDate(currentWeekMonday, index).getDate()}
              </Text>
              <Text style={{ fontSize: 8 }}>{day}</Text>
            </View>
          )
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <TimeColumn content={lessonStartTime} />
        {[0, 1, 2, 3, 4].map((dayIndex) => (
          <Column
            key={dayIndex}
            data={dummyStundenplan[dayIndex].stunden}
            indexColumn={dayIndex}
            currentWeekMonday={currentWeekMonday}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const LessonInfoModal = ({ visible, data, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View style={styles.modalHeader}>
                <Text style={styles.subject}>{data?.fach}</Text>
                <Text style={styles.teacher}>{data?.lehrer}</Text>
                <Text style={styles.room}>{data?.raum}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.homeworkContainer}></View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: screenWidth,
  },
  daysInfoBox: {
    flexDirection: "row",
    height: "9%",
    borderBottomWidth: 1,
    borderColor: "black",
    justifyContent: "flex-end",
  },
  daysInfo: {
    width: "17.6%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  scrollView: {
    flexDirection: "row",
  },
  scrollViewStyle: {
    overflow: "hidden",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  timeColumn: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "black",
  },
  column: {
    flex: 1,
    borderColor: "black",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "black",
  },
  lessonBox: {
    width: "97%",
    height: "97%",
    borderRadius: 5,
    backgroundColor: "#1d6fc2",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#4d4d4d",
  },
  lessonNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4d4d4d",
  },
  lessonText: {
    fontSize: 8,
    fontWeight: "500",
    color: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    height: "60%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 7,
    right: 7,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#4A90E2",
  },
  modalHeader: {
    marginBottom: 10,
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
  },
  subject: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4A90E2",
  },
  teacher: {
    fontSize: 14,
    color: "#333",
  },
  room: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  homeworkContainer: {
    flex: 1,
  },
});

export default TimeTable;
