export const eventTypesList = ["Frist", "Klausur", "Event"];
export const eventTypeColorList = ["#656565", "#F9D566", "#C08CFF"];

export const createEventMap = (events) => {
    const eventMap = new Map();

    events.singleEvents.forEach((event) => {
        const singleEvent = {
            day: event.day,
            date: event.day,
            eventType: event.eventType,
            title: event.title,
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

        while (currentDate <= endDate) {
            const formattedDate = currentDate.toISOString().split("T")[0];

            const periodEvent = {
                day: period.day,
                date: formattedDate,
                endDate: period.endDate,
                eventType: 2,
                name: period.title,
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
};

export const checkEvent = (day, month, year, eventMap, deadline = false) => {
    const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${day < 10 ? `0${day}` : day
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



export const checkSingleEvent = (day, month, year, eventMap) => {
    const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${day < 10 ? `0${day}` : day
        }`;

    if (eventMap.has(date)) {
        const events = eventMap.get(date);
        for (const event of events) {
            if (event.eventCategory === 1 && event.eventType !== 0) return 1;
        }
    }

    return -1;
};

export const checkDeadline = (day, month, year, eventMap) => {
    const date = `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${day < 10 ? `0${day}` : day
        }`;

    if (eventMap.has(date)) {
        const events = eventMap.get(date);
        for (const event of events) {
            if (event.eventType === 0) return 0;
        }
        return 1;
    }

    return -1;
};