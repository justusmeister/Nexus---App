// Utility functions for day styling and logic

export const isEvent = (day, month, year, eventMap, deadline = false) => {
    const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
      day < 10 ? `0${day}` : day
    }`;
    if (eventMap.has(date)) {
      const events = eventMap.get(date);
      let isDeadlineIn = false;
      let isEventIn = false;
      for (const event of events) {
        if (event.eventType === 1) return 1;
        else if (event.eventType === 2) isEventIn = true;
        else if (event.eventType === 0 && deadline) isDeadlineIn = true;
      }
      if (isDeadlineIn && deadline) return 0;
      return isEventIn ? 2 : 0;
    }
    return 0;
  };
  
  export const isSingleEvent = (day, month, year, eventMap) => {
    const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
      day < 10 ? `0${day}` : day
    }`;
    if (eventMap.has(date)) {
      const events = eventMap.get(date);
      for (const event of events) {
        if (event.eventCategory === 1 && event.eventType !== 0) return 1;
      }
      return 0;
    }
    return -1;
  };
  
  export const getBorderRadius = (
    day,
    month,
    year,
    index,
    isHoliday,
    startDay,
    endDay,
    filter,
    eventMap
  ) => {
    const isClasstest = isEvent(day, month, year, eventMap) === 1;
    const isClasstestBefore = isEvent(day - 1, month, year, eventMap) === 1;
    const isClasstestNext = isEvent(day + 1, month, year, eventMap) === 1;
  
    const isSingleEventToday = isSingleEvent(day, month, year, eventMap) === 1;
    const isSingleEventBefore = isSingleEvent(day - 1, month, year, eventMap) === 1;
    const isSingleEventNext = isSingleEvent(day + 1, month, year, eventMap) === 1;
  
    const isEventStart =
      isEvent(day, month, year, eventMap) === 2 &&
      (!isEvent(day - 1, month, year, eventMap) ||
        isSingleEvent(day, month, year, eventMap) === 1 ||
        isClasstestBefore ||
        isSingleEventBefore ||
        day === startDay);
  
    const isEventEnd =
      isEvent(day, month, year, eventMap) === 2 &&
      ((isEvent(day + 1, month, year, eventMap, true) === 0 &&
        isEvent(day + 1, month, year, eventMap) === 0) ||
        !isEvent(day + 1, month, year, eventMap) ||
        isSingleEvent(day, month, year, eventMap) === 1 ||
        isClasstestNext ||
        isSingleEventNext ||
        index === 4 ||
        day === endDay);
  
    const isWeekendStart = index === 5 || (index === 6 && day === 1);
    const isWeekendEnd = index === 6 || (index === 5 && day === endDay);
  
    const isHolidayStart = (extraArgument) => {
      return (
        isHoliday(day, month, year) &&
        isEvent(day, month, year, eventMap) !== 2 &&
        (!isHoliday(day - 1, month, year) ||
          extraArgument ||
          day === startDay)
      );
    };
  
    const isHolidayEnd = (extraArgument) => {
      return (
        isHoliday(day, month, year) &&
        isEvent(day, month, year, eventMap) !== 2 &&
        ((!isHoliday(day + 1, month, year) ||
          extraArgument ||
          day === endDay) ||
          index === 4)
      );
    };
  
    if (filter === 0 || !filter || filter === null) {
      return {
        borderTopLeftRadius:
          isClasstest && !isWeekendEnd
            ? 50
            : isWeekendStart ||
              (isHolidayStart(
                isClasstestBefore ||
                  (isEvent(day, month, year, eventMap) !== 2 &&
                    isEvent(day - 1, month, year, eventMap) === 2)
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
                  (isEvent(day, month, year, eventMap) !== 2 &&
                    isEvent(day - 1, month, year, eventMap) === 2)
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
                  (isEvent(day, month, year, eventMap) !== 2 &&
                    isEvent(day + 1, month, year, eventMap) === 2)
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
                  (isEvent(day, month, year, eventMap) !== 2 &&
                    isEvent(day + 1, month, year, eventMap) === 2)
              ) &&
                index !== 5) ||
              (isEventEnd && index !== 5)
            ? 50
            : 0,
      };
    } else if (filter === 1) {
      return {
        borderTopLeftRadius: isWeekendStart || isHolidayStart() ? 50 : 0,
        borderBottomLeftRadius: isWeekendStart || isHolidayStart() ? 50 : 0,
        borderTopRightRadius:
          isWeekendEnd || (isHolidayEnd() && index !== 5) ? 50 : 0,
        borderBottomRightRadius:
          isWeekendEnd || (isHolidayEnd() && index !== 5) ? 50 : 0,
      };
    } else if (filter === 2) {
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
    }
  };
  
  export const getDayColors = (
    day,
    month,
    year,
    index,
    isHoliday,
    startDay,
    endDay,
    filter,
    eventMap
  ) => {
    if (filter === 0 || !filter || filter === null) {
      return {
        backgroundColor:
          isEvent(day, month, year, eventMap) !== 0
            ? isEvent(day, month, year, eventMap) === 1
              ? "#F9D566"
              : "#C08CFF"
            : index === 5 || index === 6
            ? "#BFBFC4"
            : isHoliday(day, month, year)
            ? "#A4C8FF"
            : null,
      };
    } else if (filter === 1) {
      return {
        backgroundColor:
          index === 5 || index === 6
            ? "#BFBFC4"
            : isHoliday(day, month, year)
            ? "#A4C8FF"
            : null,
      };
    } else if (filter === 2) {
      return {
        backgroundColor:
          isEvent(day, month, year, eventMap) !== 0
            ? isEvent(day, month, year, eventMap) === 1
              ? "#F9D566"
              : "#C08CFF"
            : index === 5 || index === 6
            ? "#BFBFC4"
            : null,
      };
    }
  };