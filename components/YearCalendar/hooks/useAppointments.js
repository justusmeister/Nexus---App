import { useState, useEffect } from "react";
import { firestoreDB } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { eventEmitter } from "../../../eventBus";
import { createEventMap } from "../utils/eventUtils";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState(new Map());
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  useEffect(() => {
    eventEmitter.on("refreshAppointments", fetchAppointments);

    return () => {
      eventEmitter.off("refreshAppointments", fetchAppointments);
  };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } catch {
      console.log(`Fehler bei Timestamp: ${timestamp}`);
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(firestoreDB, "appointments", user.uid);
      const singleEventsRef = collection(userDocRef, "singleEvents");
      const eventPeriodsRef = collection(userDocRef, "eventPeriods");

      const singleEventsSnapshot = await getDocs(singleEventsRef);
      const singleEvents = singleEventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        day: formatTimestamp(doc.data().day),
      }));

      const eventPeriodsSnapshot = await getDocs(eventPeriodsRef);
      const eventPeriods = eventPeriodsSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          day: formatTimestamp(doc.data().day),
          endDate: formatTimestamp(doc.data().endDate),
        };
      });

      setAppointments(createEventMap({ singleEvents, eventPeriods }));
    } catch (error) {
      console.error("Fehler beim Abrufen der Termine:", error);
    } finally {
      setLoading(false);
    }
  };

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
      });

      console.log("Termin erfolgreich hinzugefügt!");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: e.message || "Ein Fehler ist aufgetreten",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
      fetchAppointments();
      eventType === 0 || saveAsDeadline
        ? addDeadline(name, day, description)
        : null;
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

      console.log("Frist erfolgreich hinzugefügt!");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: e.message || "Ein Fehler ist aufgetreten",
        visibilityTime: 4000,
      });
    } finally {
      eventEmitter.emit("refreshDeadlines");
    }
  };

  return {
    appointments,
    loading,
    addAppointment,
    fetchAppointments,
  };
};