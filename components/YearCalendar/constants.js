// Event utilities for creating event maps and handling event data

export function createEventMap(events) {
    const eventMap = new Map();
  
    events.singleEvents.forEach((event) => {
      const singleEvent = {
        day: event.day,
        eventType: event.eventType,
        name: event.name,
        eventCategory: 1,
      };
  
      if (eventMap.has(event.day)) {
        eventMap.get(event.day).push(singleEvent);
      } else {
        eventMap.set(event.day, [singleEvent]);
      }
    });
  
    events.eventPeriods.forEach((period) => {
      let currentDate = new Date(period.day);
      const endDate = new Date(period.endDate);
  
      while (currentDate.toISOString().split("T")[0] <= endDate.toISOString().split("T")[0]) {
        const formattedDate = currentDate.toISOString().split("T")[0];
  
        const periodEvent = {
          day: formattedDate,
          eventType: 2,
          name: period.name,
          eventCategory: 2,
        };
  
        if (eventMap.has(formattedDate)) {
          eventMap.get(formattedDate).push(periodEvent);
        } else {
          eventMap.set(formattedDate, [periodEvent]);
        }
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  
    return eventMap;
  }