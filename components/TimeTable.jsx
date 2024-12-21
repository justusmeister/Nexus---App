import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";

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

const Column = ({ data, indexColumn }) => {
  return (
    <View
      style={[styles.column, { borderRightWidth: indexColumn !== 4 ? 1 : 0 }]}
    >
      {data.map((item, index) => (
        <View key={index} style={[styles.cell, { height: cellHeight }]}>
          <View style={styles.lessonBox}></View>
        </View>
      ))}
    </View>
  );
};

const TimeColumn = ({ content }) => {
  return (
    <View style={styles.timeColumn}>
      {content.map((item, index) => (
        <View key={index} style={[styles.cell, { height: cellHeight }]}>
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

const setDayDate = (date, daysAmount) => {
  newDate = new Date(date);
  newDate.setDate(newDate.getDate() + daysAmount);
  return newDate;
};

const TimeTable = ({ currentWeek }) => {
  let monthAlreadyDisplayed = false;

  const createWeekDate = (currentWeek) => {
    return new Date(new Date().setDate(new Date().getDate() + 7 * currentWeek));
  };

  const currentDate = createWeekDate(currentWeek);
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
          color={"#bf5615"}
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
        {[0, 1, 2, 3, 4].map((colIndex) => (
          <Column
            key={colIndex}
            data={lessonStartTime}
            indexColumn={colIndex}
          />
        ))}
      </ScrollView>
    </View>
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
    backgroundColor: "green",
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
});

export default TimeTable;
