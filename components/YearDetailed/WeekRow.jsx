import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useHolidayData } from "../../contexts/HolidayDataContext";
import DayCell from "./DayCell";

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

    // Calculate start day of this week row
    const startDay = id === 0 ? 1 : id * 7 - firstDayDistance + 1;

    // Generate array of days for this week row
    const days = Array.from({ length: 7 }, (_, i) => {
      const day =
        id === 0
          ? i >= firstDayDistance
            ? i - firstDayDistance + 1
            : null
          : startDay + i;
      return day > 0 && day <= monthLength ? day : null;
    });

    // Skip rendering this row if it would be after the month ends
    if (startDay > monthLength) return null;

    const lastRow = startDay + 6 >= monthLength;

    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();

    const isHoliday = (day, month, year) => {
      if (day === null) return false;
      const dateStr = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
        day < 10 ? `0${day}` : day
      }`;
      return holidayData[0].data.has(dateStr) || holidayData[1].data.has(dateStr);
    };

    return (
      <View style={[styles.weekRow, { borderBottomWidth: lastRow ? 0 : 0.5 }]}>
        {days.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            month={month}
            year={year}
            index={index}
            eventMap={eventMap}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            startDay={startDay}
            endDay={monthLength}
            isHoliday={isHoliday}
          />
        ))}
      </View>
    );
  }
);

export default WeekRow;

const styles = StyleSheet.create({
  weekRow: {
    height: `${100 / 6}%`,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E0E0E0",
  },
});
