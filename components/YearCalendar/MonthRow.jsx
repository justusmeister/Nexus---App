import { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MonthBox from "./MonthBox";
import { months } from "./constants";

const MonthRow = memo(({ rowIndex, year, filter, eventMap }) => {
  const navigation = useNavigation();
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
      {[0, 1, 2].map((index) => (
        <MonthBox
          key={index}
          firstMonthDayWeekDay={calcFirstDayDate(firstMonthIndex + index)}
          month={firstMonthIndex + index}
          year={year}
          filter={filter}
          onPress={(distance, monthLength) =>
            navigation.navigate("YearDetailedScreen", {
              month: months[firstMonthIndex + index],
              date: `${year}-${firstMonthIndex + index + 1}-01`,
              distance: distance,
              monthLength: monthLength,
            })
          }
          eventMap={eventMap}
        />
      ))}
    </View>
  );
});

export default MonthRow;

const styles = StyleSheet.create({
  rowBox: {
    width: "100%",
    height: "24.5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});