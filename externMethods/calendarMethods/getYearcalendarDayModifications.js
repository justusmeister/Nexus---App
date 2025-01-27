export const getBorderRadius = (
    day,
    month,
    year,
    index,
    isHoliday,
    isEvent,
    startDay,
    endDay,
    filter
) => {
    const isClasstest = isEvent(day, month, year) === 1;
    const isClasstestBefore = isEvent(day - 1, month, year) === 1;
    const isClasstestNext = isEvent(day + 1, month, year) === 1;

    const isEventStart =
        isEvent(day, month, year) === 2 &&
        (!isEvent(day - 1, month, year) || isClasstestBefore || day === startDay);

    const isEventEnd =
        isEvent(day, month, year) === 2 &&
        (!isEvent(day + 1, month, year) ||
            isClasstestNext ||
            index === 4 ||
            day === endDay);

    const isWeekendStart = index === 5 || (index === 6 && day === 1);
    const isWeekendEnd = index === 6 || (index === 5 && day === endDay);

    const isHolidayStart = (extraArgument) => {
        return (
            isHoliday(day, month, year) &&
            (!isHoliday(day - 1, month, year) || extraArgument || day === startDay)
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

    if (filter === 0 || !filter || filter === null)
        return {
            borderTopLeftRadius:
                isClasstest && !isWeekendEnd
                    ? 50
                    : isWeekendStart ||
                        isHolidayStart(
                            isClasstestBefore ||
                            (isEvent(day, month, year) !== 2 &&
                                isEvent(day - 1, month, year) === 2)
                        ) ||
                        isEventStart
                        ? 50
                        : 0,
            borderBottomLeftRadius:
                isClasstest && !isWeekendEnd
                    ? 50
                    : isWeekendStart ||
                        isHolidayStart(
                            isClasstestBefore ||
                            (isEvent(day, month, year) !== 2 &&
                                isEvent(day - 1, month, year) === 2)
                        ) ||
                        isEventStart
                        ? 50
                        : 0,
            borderTopRightRadius:
                isClasstest && !isWeekendStart
                    ? 50
                    : isWeekendEnd ||
                        (isHolidayEnd(
                            isClasstestNext ||
                            (isEvent(day, month, year) !== 2 &&
                                isEvent(day + 1, month, year) === 2)
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
                            (isEvent(day, month, year) !== 2 &&
                                isEvent(day + 1, month, year) === 2)
                        ) &&
                            index !== 5) ||
                        (isEventEnd && index !== 5)
                        ? 50
                        : 0,
        };
    else if (filter === 1)
        return {
            borderTopLeftRadius: isWeekendStart || isHolidayStart() ? 50 : 0,
            borderBottomLeftRadius: isWeekendStart || isHolidayStart() ? 50 : 0,
            borderTopRightRadius:
                isWeekendEnd || (isHolidayEnd() && index !== 5) ? 50 : 0,
            borderBottomRightRadius:
                isWeekendEnd || (isHolidayEnd() && index !== 5) ? 50 : 0,
        };
    else if (filter === 2)
        return {
            borderTopLeftRadius:
                isClasstest && !isWeekendEnd
                    ? 50
                    : isWeekendStart || isEventStart
                        ? 50
                        : 0,
            borderBottomLeftRadius:
                isClasstest && !isWeekendEnd
                    ? 50
                    : isWeekendStart || isEventStart
                        ? 50
                        : 0,
            borderTopRightRadius:
                isClasstest && !isWeekendStart
                    ? 50
                    : isWeekendEnd || (isEventEnd && index !== 5)
                        ? 50
                        : 0,
            borderBottomRightRadius:
                isClasstest && !isWeekendStart
                    ? 50
                    : isWeekendEnd || (isEventEnd && index !== 5)
                        ? 50
                        : 0,
        };
};

export const getDayColors = (
    day,
    month,
    year,
    index,
    isHoliday,
    isEvent,
    filter
) => {
    if (filter === 0 || !filter || filter === null)
        return {
            backgroundColor:
                isEvent(day, month, year) !== 0
                    ? isEvent(day, month, year) === 1
                        ? "#fcd968"
                        : "#9f65f0"
                    : index === 5 || index === 6
                        ? "#c4c4c4"
                        : isHoliday(day, month, year)
                            ? "#b4d3ed"
                            : null,
        };
    else if (filter === 1)
        return {
            backgroundColor:
                index === 5 || index === 6
                    ? "#c4c4c4"
                    : isHoliday(day, month, year)
                        ? "#b4d3ed"
                        : null,
        };
    else if (filter === 2)
        return {
            backgroundColor:
                isEvent(day, month, year) !== 0
                    ? isEvent(day, month, year) === 1
                        ? "#fcd968"
                        : "#9f65f0"
                    : index === 5 || index === 6
                        ? "#c4c4c4"
                        : null,
        };
};