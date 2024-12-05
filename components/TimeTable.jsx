import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";

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

const { height: screenHeight } = Dimensions.get("window");
const cellHeight = screenHeight * 0.06;

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
          <Text style={styles.timeText}>{lessonStartTime[index]}</Text>
        </View>
      ))}
    </View>
  );
};

const TimeTable = () => {
  return (
    <View style={styles.container}>
      <View style={styles.daysInfoBox}>
        {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(
          (day, index) => (
            <View key={index} style={styles.daysInfo}>
              <Text style={{ fontSize: 8, fontWeight: "500" }}>
                {index === 0 ? "DEZ." : null}
              </Text>
              <Text style={{ fontSize: 19, fontWeight: "600" }}>
                {index + 1}
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
    flex: 1,
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
    fontSize: 11,
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
