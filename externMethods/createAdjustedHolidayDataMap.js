import { parseISO, formatISO, addDays } from "date-fns";

const createDaysOutOfTimePeriods = (start, end) => {
    const days = [];
    let periodPositionsDate = parseISO(start);
    const endDate = parseISO(end);

    while (periodPositionsDate <= endDate) {
        days.push(formatISO(periodPositionsDate, { representation: "date" }));
        periodPositionsDate = addDays(periodPositionsDate, 1);
    }

    return days;
};

export const createAdjustedHolidayDataMap = (holidayData) => {
    const holidayMap = new Map();

    holidayData.forEach((holiday) => {
        const { startDate, endDate, name } = holiday;
        const holidayName = name[0]?.text || "freier Tag";
        const days = createDaysOutOfTimePeriods(startDate, endDate);

        days.forEach((day) => {
            holidayMap.set(day, { name: holidayName, startDate, endDate });
        });
    });

    return holidayMap;
};