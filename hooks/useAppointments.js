import { useState, useCallback } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { firestoreDB } from '../firebaseConfig';
import { formatTimestamp, parseDateToTimestampRange } from '../components/YearDetailed/utils/dateUtils';
import { createEventMap } from '../components/YearDetailed/utils/eventMapUtils';
import { eventEmitter } from '../eventBus';
import Toast from 'react-native-toast-message';

export const useAppointments = (user) => {
    const [appointments, setAppointments] = useState(new Map());
    const [deadlinesList, setDeadlinesList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(
        async (startDate, monthLength) => {
            if (!user) return;

            try {
                const userDocRef = doc(firestoreDB, "appointments", user.uid);
                const singleEventsRef = collection(userDocRef, "singleEvents");
                const eventPeriodsRef = collection(userDocRef, "eventPeriods");

                const { start, end } = parseDateToTimestampRange(
                    startDate,
                    `${new Date(startDate).getFullYear()}-${new Date(startDate).getMonth() + 1
                    }-${monthLength}`
                );

                const singleEventsQuery = query(
                    singleEventsRef,
                    where("day", ">=", start),
                    where("day", "<=", end),
                    orderBy("day")
                );
                const singleEventsSnapshot = await getDocs(singleEventsQuery);
                const singleEvents = singleEventsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    day: formatTimestamp(doc.data().day),
                    eventCategory: 1,
                }));

                const eventPeriodsQuery1 = query(
                    eventPeriodsRef,
                    where("day", ">=", start),
                    where("day", "<=", end),
                    orderBy("day")
                );

                const eventPeriodsQuery2 = query(
                    eventPeriodsRef,
                    where("endDate", ">=", start),
                    where("endDate", "<=", end)
                );

                const [eventPeriodsSnapshot1, eventPeriodsSnapshot2] = await Promise.all([
                    getDocs(eventPeriodsQuery1),
                    getDocs(eventPeriodsQuery2),
                ]);

                const eventPeriods = [
                    ...eventPeriodsSnapshot1.docs,
                    ...eventPeriodsSnapshot2.docs,
                ]
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        title: doc.data().name,
                        date: doc.data().day,
                        day: formatTimestamp(doc.data().day),
                        endDate: formatTimestamp(doc.data().endDate),
                        eventCategory: 2,
                    }))
                    .filter(
                        (event, index, self) =>
                            index === self.findIndex((e) => e.id === event.id) // Remove duplicates
                    );

                setAppointments(createEventMap({ singleEvents, eventPeriods }));
                setDeadlinesList([...singleEvents, ...eventPeriods]);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    const addAppointment = async (
        name,
        day,
        endDate,
        eventType,
        description,
        singleEvent,
        saveAsDeadline
    ) => {
        if (!user) return;

        try {
            setLoading(true);

            const subcollectionName = singleEvent ? "singleEvents" : "eventPeriods";

            const userDocRef = doc(firestoreDB, "appointments", user.uid);
            const subcollectionRef = collection(userDocRef, subcollectionName);

            await addDoc(subcollectionRef, {
                name,
                day,
                ...(singleEvent ? {} : { endDate }),
                eventType,
                description,
                timestamp: serverTimestamp(),
            }).then((docRef) => {
                const newEvent = {
                    id: docRef.id,
                    name,
                    day: formatTimestamp(day),
                    ...(singleEvent ? {} : { endDate: formatTimestamp(endDate) }),
                    description,
                    eventCategory: singleEvent ? 1 : 2,
                };

                setAppointments((prev) => {
                    const updated = new Map(prev);
                    const dateKey = formatTimestamp(day);
                    updated.set(dateKey, [...(updated.get(dateKey) || []), newEvent]);
                    return updated;
                });

                setDeadlinesList((prev) => [...prev, newEvent]);
            });

            if (eventType === 0 || saveAsDeadline) {
                await addDeadline(name, day, description);
            }
            eventEmitter.emit("refreshAppointments");
        } catch (e) {
            Toast.show({
                type: "error",
                text1: "Error:",
                text2: e.message || "An error occurred",
                visibilityTime: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    const addDeadline = async (name, day, description) => {
        if (!user) return;

        try {
            const deadlineCollectionRef = collection(
                firestoreDB,
                "deadlines",
                user.uid,
                "deadlinesList"
            );

            await addDoc(deadlineCollectionRef, {
                name,
                day,
                description,
                timestamp: serverTimestamp(),
            });
        } catch (e) {
            Toast.show({
                type: "error",
                text1: "Error:",
                text2: e.message || "An error occurred",
                visibilityTime: 4000,
            });
        } finally {
            eventEmitter.emit("refreshDeadlines");
        }
    };

    const updateAppointment = async (
        title,
        description,
        dueDate,
        endDate,
        eventCategory,
        itemId
    ) => {
        if (!user) return;

        try {
            const userAppointmentsRef = doc(firestoreDB, "appointments", user.uid);
            let appointmentDocRef;

            if (eventCategory === 1) {
                appointmentDocRef = doc(userAppointmentsRef, "singleEvents", itemId);
            } else {
                appointmentDocRef = doc(userAppointmentsRef, "eventPeriods", itemId);
            }

            await setDoc(
                appointmentDocRef,
                {
                    name: title,
                    description: description,
                    day: dueDate,
                    endDate: eventCategory === 2 ? endDate : null,
                    timestamp: serverTimestamp(),
                },
                { merge: true }
            ).then(() => {
                const updatedEvent = {
                    id: itemId,
                    name: title,
                    description,
                    day: formatTimestamp(dueDate),
                    ...(eventCategory === 2 && { endDate: formatTimestamp(endDate) }),
                    eventCategory,
                };

                setAppointments((prev) => {
                    const newMap = new Map(prev);
                    // Remove from old date entries
                    for (const [key, val] of newMap.entries()) {
                        newMap.set(key, val.filter((e) => e.id !== itemId));
                    }
                    const dateKey = formatTimestamp(dueDate);
                    newMap.set(dateKey, [...(newMap.get(dateKey) || []), updatedEvent]);
                    return newMap;
                });

                setDeadlinesList((prev) =>
                    prev.map((e) => (e.id === itemId ? updatedEvent : e))
                );
            });

            eventEmitter.emit("refreshAppointments");
        } catch (e) {
            Toast.show({
                type: "error",
                text1: "Error:",
                text2: e.message || "Unknown error",
                visibilityTime: 4000,
            });
        }
    };

    const deleteAppointment = async (singleEvent, itemId) => {
        if (!user) return;

        try {
            const userDocRef = doc(firestoreDB, "appointments", user.uid);

            if (singleEvent) {
                const singleEventRef = doc(userDocRef, "singleEvents", itemId);
                await deleteDoc(singleEventRef);
            } else {
                const eventPeriodsRef = doc(userDocRef, "eventPeriods", itemId);
                await deleteDoc(eventPeriodsRef);
            }

            eventEmitter.emit("refreshAppointments");
            setAppointments((prev) => {
                const newMap = new Map(prev);
                for (const [date, events] of newMap.entries()) {
                    const filteredEvents = events.filter(e => e.id !== itemId);
                    if (filteredEvents.length === 0) {
                        newMap.delete(date);
                    } else {
                        newMap.set(date, filteredEvents);
                    }
                }
                return newMap;
            });

            setDeadlinesList((prev) => prev.filter(e => e.id !== itemId));

        } catch (e) {
            Toast.show({
                type: "error",
                text1: "Error:",
                text2: e.message || "An error occurred",
                visibilityTime: 4000,
            });
        }
    };

    return {
        appointments,
        deadlinesList,
        loading,
        fetchAppointments,
        addAppointment,
        addDeadline,
        updateAppointment,
        deleteAppointment,
    };
};