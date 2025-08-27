import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useHolidayData } from "../../contexts/HolidayDataContext";
import { getDayColors, getBorderRadius } from "./utils/dayUtils";

const DayRow = memo(
  ({ id, distance, endDay, month, year, filter, eventMap }) => {
    const { holidayData } = useHolidayData();

    const startDay = id === 0 ? 1 : id * 7 - distance + 1;

    const days = Array.from({ length: 7 }, (_, i) => {
      const day =
        id === 0 ? (i >= distance ? i - distance + 1 : null) : startDay + i;
      return day > 0 && day <= endDay ? day : null;
    });

    const isToday = (d, m, y) => {
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return d === currentDay && m === currentMonth && y === currentYear;
    };

    const isHoliday = (day, month, year) => {
      const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
        day < 10 ? `0${day}` : day
      }`;
      return holidayData[0].data.has(date) || holidayData[1].data.has(date);
    };

    return (
      <View style={styles.dayRowBox}>
        {days.map((day, index) => {
          if (day > endDay || day < 1)
            return <View key={index} style={styles.dayBox} />;
          return (
            <View
              key={index}
              style={[
                styles.dayBox,
                {
                  ...getDayColors(
                    day,
                    month,
                    year,
                    index,
                    isHoliday,
                    startDay,
                    endDay,
                    filter,
                    eventMap
                  ),
                  ...getBorderRadius(
                    day,
                    month,
                    year,
                    index,
                    isHoliday,
                    startDay,
                    endDay,
                    filter,
                    eventMap
                  ),
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isToday(day, month, year) ? "red" : "#333",
                    fontSize: RFPercentage(1.41),
                    fontWeight: isToday(day, month, year) ? "600" : "600",
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
);

export default DayRow;

const styles = StyleSheet.create({
  dayRowBox: {
    flexDirection: "row",
    width: "100%",
    height: "16.66%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayBox: {
    width: "14.285%",
    height: "95%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    textAlign: "center",
  },
});