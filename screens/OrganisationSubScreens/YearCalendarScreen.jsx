import { useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useHolidayData } from "../../contexts/HolidayDataContext";

const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const dummyEvents = {
  singleEvents: [
    {
      day: "2025-02-06",
      eventType: 1,
      name: "Deutscharbeit",
    },
    {
      day: "2025-03-12",
      eventType: 1,
      name: "Matheklausur",
    },
    {
      day: "2025-04-10",
      eventType: 1,
      name: "Englischprüfung",
    },
    {
      day: "2025-05-22",
      eventType: 0,
      name: "Konzert der Schulband",
    },
    {
      day: "2025-06-14",
      eventType: 0,
      name: "Schulfest",
    },
  ],
  eventPeriods: [
    {
      startDay: "2025-03-08",
      endDay: "2025-03-15",
      name: "Projektwoche",
    },
    {
      startDay: "2025-05-01",
      endDay: "2025-05-05",
      name: "Praktikum",
    },
  ],
};

const YearCalendarScreen = function () {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.containerYearCalendar}>
          <View style={styles.yearCalendarBox}>
            <View style={styles.contentContainer}>
              <View style={styles.headerBox}>
                <Text style={styles.headerTitleText}>{currentYear}</Text>
              </View>
              <View style={styles.yearBox}>
                <MonthRow rowIndex={0} year={currentYear} />
                <MonthRow rowIndex={1} year={currentYear} />
                <MonthRow rowIndex={2} year={currentYear} />
                <MonthRow rowIndex={3} year={currentYear} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default YearCalendarScreen;

const MonthRow = ({ rowIndex, year }) => {
  const firstMonthIndex = rowIndex * 3;
  const calcFirstDayDate = (monthIndex) => {
    const adjustedYear = monthIndex < 2 ? year - 1 : year;
    const m = ((monthIndex + 10) % 12) + 1;

    const c = Math.floor(adjustedYear / 100);
    const y = adjustedYear % 100;

    const dayOfWeek =
      (1 +
        Math.floor(2.6 * m - 0.2) +
        y +
        Math.floor(y / 4) +
        Math.floor(c / 4) -
        2 * c) %
      7;

    return (dayOfWeek + 7) % 7;
  };

  return (
    <View style={styles.rowBox}>
      <MonthBox
        firstMonthDayWeekDay={calcFirstDayDate(firstMonthIndex)}
        month={firstMonthIndex}
        year={year}
      />
      <MonthBox
        firstMonthDayWeekDay={calcFirstDayDate(firstMonthIndex + 1)}
        month={firstMonthIndex + 1}
        year={year}
      />
      <MonthBox
        firstMonthDayWeekDay={calcFirstDayDate(firstMonthIndex + 2)}
        month={firstMonthIndex + 2}
        year={year}
      />
    </View>
  );
};

const MonthBox = ({ firstMonthDayWeekDay, month, year }) => {
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

  const secondWeekStartDay =
    firstMonthDayWeekDay !== 0 ? 8 - (firstMonthDayWeekDay - 1) : 2;

  const lastDayOfMonth = monthLength();

  return (
    <TouchableOpacity style={styles.monthBox}>
      <Text style={styles.monthTitle}>{months[month]}</Text>
      <View style={{ flex: 1 }}>
        <DayRow
          distance={firstMonthDayWeekDay !== 0 ? firstMonthDayWeekDay - 1 : 6}
          startDay={1}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 7}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 14}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 21}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
        />
        <DayRow
          distance={0}
          startDay={secondWeekStartDay + 28}
          endDay={lastDayOfMonth}
          month={month}
          year={year}
        />
      </View>
    </TouchableOpacity>
  );
};

const DayRow = ({ distance, startDay, endDay, month, year }) => {
  const { holidayData } = useHolidayData();

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
  const getBorderRadius = (
    day,
    month,
    year,
    index,
    isHoliday,
    startDay,
    endDay
  ) => {
    const isWeekendStart = index === 5 || (index === 6 && day === 1);
    const isWeekendEnd = index === 6 || (index === 5 && day === endDay);

    const isHolidayStart =
      isHoliday(day, month, year) &&
      (!isHoliday(day - 1, month, year) || day === startDay);
    const isHolidayEnd =
      (isHoliday(day, month, year) &&
        (!isHoliday(day + 1, month, year) || day === endDay)) ||
      index === 4;

    return {
      borderTopLeftRadius: isWeekendStart || isHolidayStart ? 50 : 0,
      borderBottomLeftRadius: isWeekendStart || isHolidayStart ? 50 : 0,
      borderTopRightRadius:
        isWeekendEnd || (isHolidayEnd && index !== 5) ? 50 : 0,
      borderBottomRightRadius:
        isWeekendEnd || (isHolidayEnd && index !== 5) ? 50 : 0,
    };
  };
  return (
    <View style={styles.dayRowBox}>
      {Array.from({ length: 7 }).map((_, index) => {
        const day = startDay - distance + index;
        if (day > endDay || day < 1)
          return <View key={index} style={styles.dayBox} />;
        return (
          <View
            key={index}
            style={[
              styles.dayBox,
              {
                backgroundColor:
                  index === 5 || index === 6
                    ? "#c4c4c4"
                    : isHoliday(day, month, year)
                    ? "#b4d3ed"
                    : null,
                ...getBorderRadius(
                  day,
                  month,
                  year,
                  index,
                  isHoliday,
                  startDay,
                  endDay
                ),
              },
            ]}
          >
            <Text
              style={[
                styles.dayText,
                {
                  color: isToday(day, month, year) ? "red" : "#333",
                  fontSize: isToday(day, month, year) ? 11 : 10,
                  fontWeight: isToday(day, month, year) ? "700" : "600",
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
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 89,
  },
  containerYearCalendar: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  yearCalendarBox: {
    flex: 1,
    width: "100%",
    padding: 8,
    paddingTop: 0,
    backgroundColor: "#a1a1a1",
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBox: {
    height: "10%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  yearBox: {
    height: "85%",
    width: "100%",
    paddingHorizontal: 3,
    justifyContent: "space-between",
  },
  headerTitleText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ff3c00",
  },
  monthBox: {
    width: "33.333%",
    height: "100%",
    padding: 3,
  },
  rowBox: {
    width: "100%",
    height: "24.5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
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
