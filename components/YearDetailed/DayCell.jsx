import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icon from "@expo/vector-icons";
import { isToday } from './utils/dateUtils';
import { checkEvent, checkSingleEvent, checkDeadline } from './utils/eventUtils';
import { RFPercentage } from "react-native-responsive-fontsize";

const DayCell = memo(({ 
  day, 
  month, 
  year, 
  index, 
  eventMap, 
  selectedDay, 
  setSelectedDay, 
  startDay, 
  endDay, 
  isHoliday 
}) => {
  if (day === null || day < 1 || day > endDay) {
    return <View key={index} style={styles.dayButton} />;
  }

  const getBorderRadius = () => {
    const isClasstest = checkEvent(day, month, year, eventMap) === 1;
    const isClasstestBefore = checkEvent(day - 1, month, year, eventMap) === 1;
    const isClasstestNext = checkEvent(day + 1, month, year, eventMap) === 1;

    const isSingleEventBefore = checkSingleEvent(day - 1, month, year, eventMap) === 1;
    const isSingleEventNext = checkSingleEvent(day + 1, month, year, eventMap) === 1;

    const isEventStart =
      checkEvent(day, month, year, eventMap) === 2 &&
      (!checkEvent(day - 1, month, year, eventMap) ||
        checkSingleEvent(day, month, year, eventMap) === 1 ||
        isClasstestBefore ||
        isSingleEventBefore ||
        day === startDay);

    const isEventEnd =
      checkEvent(day, month, year, eventMap) === 2 &&
      ((checkDeadline(day + 1, month, year, eventMap) === 0 &&
        checkEvent(day + 1, month, year, eventMap) === 0) ||
        checkSingleEvent(day, month, year, eventMap) === 1 ||
        !checkEvent(day + 1, month, year, eventMap) ||
        isClasstestNext ||
        isSingleEventNext ||
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

    return {
      borderTopLeftRadius:
        isClasstest && !isWeekendEnd
          ? 50
          : isWeekendStart ||
            (isHolidayStart(
              isClasstestBefore ||
                (checkEvent(day, month, year, eventMap) !== 2 &&
                  checkEvent(day - 1, month, year, eventMap) === 2)
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
                (checkEvent(day, month, year, eventMap) !== 2 &&
                  checkEvent(day - 1, month, year, eventMap) === 2)
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
                (checkEvent(day, month, year, eventMap) !== 2 &&
                  checkEvent(day + 1, month, year, eventMap) === 2)
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
                (checkEvent(day, month, year, eventMap) !== 2 &&
                  checkEvent(day + 1, month, year, eventMap) === 2)
            ) &&
              index !== 5) ||
            (isEventEnd && index !== 5)
          ? 50
          : 0,
    };
  };

  const getDayColors = () => {
    return {
      backgroundColor:
        checkEvent(day, month, year, eventMap) === 1 || checkEvent(day, month, year, eventMap) === 2
          ? checkEvent(day, month, year, eventMap) === 1
            ? "#F9D566"
            : "#C08CFF"
          : index === 5 || index === 6
          ? "#BFBFC4"
          : isHoliday(day, month, year)
          ? "#A4C8FF"
          : null,
    };
  };

  const hasDeadline = checkDeadline(day, month, year, eventMap) === 0;

  return (
    <View
      style={[
        styles.dayButton,
        getDayColors(),
        getBorderRadius(),
      ]}
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
            opacity: hasDeadline ? 1 : 0,
          }}
        />
      </TouchableOpacity>
    </View>
  );
});

export default DayCell;

const styles = StyleSheet.create({
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
});
