import { memo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import DayRow from "./DayRow";
import { months } from "./constants";

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

    const lastDayOfMonth = monthLength();
    const distance = firstMonthDayWeekDay !== 0 ? firstMonthDayWeekDay - 1 : 6;

    return (
      <TouchableOpacity
        style={styles.monthBox}
        onPress={() => onPress(distance, lastDayOfMonth)}
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

export default MonthBox;

const styles = StyleSheet.create({
  monthBox: {
    width: "33.333%",
    height: "100%",
    padding: 3,
  },
  monthTitle: {
    fontSize: RFPercentage(2.05),
    fontWeight: "600",
    color: "#333",
  },
});