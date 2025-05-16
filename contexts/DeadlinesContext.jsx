import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestoreDB } from "../firebaseConfig";
import Toast from "react-native-toast-message";
import { eventEmitter } from "../eventBus";
import { checkDeadlineRemainingTime } from "../utils/checkDeadlineRemainingTime";

const DeadlinesContext = createContext();

export const useDeadlinesData = () => useContext(DeadlinesContext);

export const DeadlinesProvider = ({ children }) => {
  const [deadlinesData, setDeadlinesData] = useState(["loading"]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
  };

  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(2000 + year, month - 1, day, 7, 0, 0);
  };

  const deleteDeadline = async (deadlineId) => {
    if (!user) return;
    
    try {
      const deadlineRef = doc(
        firestoreDB,
        "deadlines",
        user.uid,
        "deadlinesList",
        deadlineId
      );

      await deleteDoc(deadlineRef);

      setDeadlinesData((prevDeadlines) =>
        prevDeadlines.filter((item) => item.id !== deadlineId)
      );
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fehler:",
        text2: "Beim Löschen der Deadline ist ein Fehler aufgetreten.",
        visibilityTime: 4000,
      });
      console.error("Fehler beim Löschen der Deadline:", e);
    }
  };

  const fetchDeadlines = async () => {
    if (!user) return;
    
    try {
      const deadlinesRef = collection(
        firestoreDB,
        "deadlines",
        user.uid,
        "deadlinesList"
      );
      const deadlinesSnapshot = await getDocs(deadlinesRef);

      const deadlines = deadlinesSnapshot.docs.map((doc) => ({
        id: doc.id,
        subject: doc.data().name,
        task: doc.data().description,
        dueDate: formatTimestamp(doc.data().day),
        canDelete:
          checkDeadlineRemainingTime(formatTimestamp(doc.data().day)).time ===
          "delete"
            ? true
            : false,
      }));

      const currentDate = new Date();

      const upcomingDues = deadlines
        .filter((d) => parseDateString(d.dueDate) >= currentDate)
        .sort(
          (a, b) => parseDateString(a.dueDate) - parseDateString(b.dueDate)
        );

      const pastDues = deadlines
        .filter((d) => parseDateString(d.dueDate) < currentDate)
        .sort(
          (a, b) => parseDateString(b.dueDate) - parseDateString(a.dueDate)
        );

      const sortedDeadlines = [...upcomingDues, ...pastDues];

      setDeadlinesData(sortedDeadlines);

      // Auto-delete past deadlines marked for deletion
      for (const deadline of deadlines) {
        if (deadline.canDelete) {
          await deleteDeadline(deadline.id);
        }
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Termine:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();

    eventEmitter.on("refreshDeadlines", fetchDeadlines);

    return () => {
      eventEmitter.off("refreshDeadlines", fetchDeadlines);
    };
  }, []);

  const value = {
    deadlinesData,
    loading,
    deleteDeadline,
    fetchDeadlines,
    changeData: setDeadlinesData,
  };

  return (
    <DeadlinesContext.Provider value={value}>
      {children}
    </DeadlinesContext.Provider>
  );
};