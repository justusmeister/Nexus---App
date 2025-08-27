import { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import MonthRow from "./MonthRow";

const YearCalendarItem = memo(({ year, currentYear, containerHeight, filter, appointments }) => {
  return (
    <View style={[styles.yearCalendarBox, { height: containerHeight }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerBox}>
          <Text
            style={[
              styles.headerTitleText,
              { color: year === currentYear ? "red" : "white" },
            ]}
          >
            {year}
          </Text>
        </View>
        <View style={styles.yearBox}>
          {[0, 1, 2, 3].map((index) => (
            <MonthRow
              key={index}
              rowIndex={index}
              year={year}
              filter={filter}
              eventMap={appointments}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

export default YearCalendarItem;

const styles = StyleSheet.create({
  yearCalendarBox: {
    flex: 1,
    padding: 8,
    paddingTop: 0,
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
    fontSize: RFPercentage(4),
    fontWeight: "900",
    color: "#ff3c00",
  },
});