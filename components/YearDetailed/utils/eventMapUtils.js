export function createEventMap(events) {
    const eventMap = new Map();

    if (!events || !events.singleEvents) return eventMap;

    events.singleEvents.forEach((event) => {
        const singleEvent = {
            id: `s_${event.id}`,
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

    if (events.eventPeriods) {
        events.eventPeriods.forEach((period) => {
            let currentDate = new Date(period.day);
            const endDate = new Date(period.endDate);

            while (currentDate <= endDate) {
                const formattedDate = currentDate.toISOString().split("T")[0];

                const periodEvent = {
                    id: `p_${period.id}`,
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
    }

    return eventMap;
}