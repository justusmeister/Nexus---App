import { useState, useEffect, useCallback } from "react";
import {
  collection, query, where, orderBy, getDocs, setDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { firestoreDB } from "../firebaseConfig";
import { getCountFromServer } from "firebase/firestore";

export const useSubjects = (user) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(firestoreDB, "subjects"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "asc")
      );
      const snapshot = await getDocs(q);
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const homeworkColRef = collection(docSnap.ref, "homework");
          const countSnap = await getCountFromServer(homeworkColRef);
          return { id: docSnap.id, ...docSnap.data(), items: countSnap.data().count };
        })
      );
      setSubjects(data);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addSubject = useCallback(async (subject, color, icon) => {
    if (!user) return;
    const newDocRef = doc(firestoreDB, "subjects", user.uid + subject);
    await setDoc(newDocRef, {
      subject, color, icon,
      timestamp: serverTimestamp(),
      userId: user.uid,
    });
    await fetchSubjects();
  }, [user, fetchSubjects]);

  const deleteSubject = useCallback(async (subject) => {
    if (!user) return;
    await deleteDoc(doc(firestoreDB, "subjects", user.uid + subject));
    setSubjects((prev) => prev.filter((s) => s.subject !== subject));
  }, [user]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return { subjects, loading, addSubject, deleteSubject };
};
