import { useState, useEffect, memo, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  InteractionManager,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { useHolidayData } from "../contexts/HolidayDataContext";
import { RFPercentage } from "react-native-responsive-fontsize";

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

const dummyStundenplan = [
  {
    stunden: [
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Deutsch", raum: "102", lehrer: "Frau Schmidt" },
      { fach: "Deutsch", raum: "102", lehrer: "Frau Schmidt" },
      { fach: "Biologie", raum: "103", lehrer: "Herr Braun" },
      { fach: "Biologie", raum: "103", lehrer: "Herr Braun" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Sport", raum: "105", lehrer: "Herr Schulz" },
    ],
  },
  {
    stunden: [
      { fach: "Englisch", raum: "201", lehrer: "Herr Keller" },
      { fach: "Englisch", raum: "201", lehrer: "Herr Keller" },
      { fach: "Chemie", raum: "202", lehrer: "Frau Weber" },
      { fach: "Chemie", raum: "202", lehrer: "Frau Weber" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Chemie", raum: "202", lehrer: "Frau Weber" },
      { fach: "Französisch", raum: "204", lehrer: "Herr Dupont" },
      { fach: "Französisch", raum: "204", lehrer: "Herr Dupont" },
    ],
  },
  {
    stunden: [
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Sport", raum: "301", lehrer: "Herr Schulz" },
      { fach: "Sport", raum: "301", lehrer: "Herr Schulz" },
      { fach: "Französisch", raum: "401", lehrer: "Herr Dupont" },
      { fach: "Französisch", raum: "401", lehrer: "Herr Dupont" },
    ],
  },
  {
    stunden: [
      { fach: "Französisch", raum: "401", lehrer: "Herr Dupont" },
      { fach: "Französisch", raum: "401", lehrer: "Herr Dupont" },
      { fach: "Erdkunde", raum: "402", lehrer: "Frau Schneider" },
      { fach: "Französisch", raum: "204", lehrer: "Herr Dupont" },
      { fach: "Informatik", raum: "403", lehrer: "Herr Hoffmann" },
      { fach: "Informatik", raum: "403", lehrer: "Herr Hoffmann" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
    ],
  },
  {
    stunden: [
      { fach: "Deutsch", raum: "102", lehrer: "Frau Schmidt" },
      { fach: "Deutsch", raum: "102", lehrer: "Frau Schmidt" },
      { fach: "Physik", raum: "501", lehrer: "Herr Müller" },
      { fach: "Physik", raum: "501", lehrer: "Herr Müller" },
      { fach: "Mathematik", raum: "101", lehrer: "Herr Müller" },
      { fach: "Englisch", raum: "201", lehrer: "Herr Keller" },
    ],
  },
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
    { length: 10 - data?.length || 0 },
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
              style={{ fontSize: RFPercentage(2.05), fontWeight: "500", color: "white" }}
            >
              {char}
            </Text>
          ))}
        </View>
      ) : (
        data?.map((item, index) => {
          const isDoubleLesson =
            index < data.length - 1 &&
            dummyStundenplan[indexColumn].stunden[index]?.fach ===
              dummyStundenplan[indexColumn].stunden[index + 1]?.fach &&
            dummyStundenplan[indexColumn].stunden[index]?.raum ===
              dummyStundenplan[indexColumn].stunden[index + 1]?.raum;

          const isLastDoubleLesson =
            index > 0 &&
            dummyStundenplan[indexColumn].stunden[index]?.fach ===
              dummyStundenplan[indexColumn].stunden[index - 1]?.fach &&
            dummyStundenplan[indexColumn].stunden[index]?.raum ===
              dummyStundenplan[indexColumn].stunden[index - 1]?.raum;

          if (isLastDoubleLesson) {
            return null; 
          }

          if (isDoubleLesson) {
            return (
              <View
                key={index}
                style={[styles.cell, { height: cellHeight * 2 }]}
              >
                <TouchableOpacity
                  style={styles.lessonBox}
                  activeOpacity={0.4}
                  onPress={() => {
                    setCurrentLessonData(data[index]);
                    setIsModalVisible(true);
                  }}
                >
                  <Text style={styles.lessonText}>{data[index]?.fach}</Text>
                  <Text style={styles.lessonText}>{data[index]?.raum}</Text>
                  <Text style={styles.lessonText}>{data[index]?.lehrer}</Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            return (
              <View key={index} style={[styles.cell, { height: cellHeight }]}>
                <TouchableOpacity
                  style={styles.lessonBox}
                  activeOpacity={0.4}
                  onPress={() => {
                    setCurrentLessonData(data[index]);
                    setIsModalVisible(true);
                  }}
                >
                  <Text style={styles.lessonText}>{data[index]?.fach}</Text>
                  <Text style={styles.lessonText}>{data[index]?.raum}</Text>
                  <Text style={styles.lessonText}>{data[index]?.lehrer}</Text>
                </TouchableOpacity>
              </View>
            );
          }
        })
      )}
      {!isHoliday(columnDay) && data?.length < 10
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
  const currentDate = useMemo(() => createWeekDate(currentWeek), [currentWeek]);

  const distanceToCurrentWeekMonday = useMemo(() => {
    return (currentDate.getDay() + 6) % 7;
  }, [currentDate]);

  const currentWeekMonday = useMemo(() => {
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() - distanceToCurrentWeekMonday);
    return monday;
  }, [currentDate, distanceToCurrentWeekMonday]);

  const monthDisplayed = useRef(false);

  const checkDateMonth = (mondayDate, dayDate) => {
    if (mondayDate.getMonth() === dayDate.getMonth()) {
      return 12;
    } else if (!monthDisplayed.current) {
      monthDisplayed.current = true;
      return dayDate.getMonth();
    } else {
      return 12;
    }
  };

  return (
    <View style={styles.container}>
      {currentWeek === 0 && (
        <Icon.FontAwesome
          name="circle"
          size={13}
          color={"#d17002"}
          style={{ position: "absolute", top: 15, left: 15 }}
        />
      )}
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
              <Text style={{ fontSize: RFPercentage(1.02), fontWeight: "500" }}>
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
                  fontSize: RFPercentage(2.56),
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
              <Text style={{ fontSize: RFPercentage(1.02) }}>{day}</Text>
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
            data={dummyStundenplan[dayIndex]?.stunden}
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
    fontSize: RFPercentage(1.41),
    fontWeight: "500",
    color: "#4d4d4d",
  },
  lessonNumber: {
    fontSize: RFPercentage(2.18),
    fontWeight: "600",
    color: "#4d4d4d",
  },
  lessonText: {
    fontSize: RFPercentage(1.02),
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
    fontSize: RFPercentage(3.21),
    color: "#4A90E2",
  },
  modalHeader: {
    marginBottom: 10,
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
  },
  subject: {
    fontWeight: "600",
    fontSize: RFPercentage(2.18),
    color: "#4A90E2",
  },
  teacher: {
    fontSize: RFPercentage(1.92),
    color: "#333",
  },
  room: {
    fontSize: RFPercentage(1.67),
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

export default memo(TimeTable);
