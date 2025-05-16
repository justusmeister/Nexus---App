import { useState, useEffect, useCallback } from "react";
import {
  collection, query, where, orderBy, getDocs, setDoc, deleteDoc, doc, serverTimestamp, getCountFromServer
} from "firebase/firestore";
import { firestoreDB } from "../firebaseConfig";

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
        snapshot.docs.map(async (docSnap, i) => {
          const countSnap = await getCountFromServer(collection(docSnap.ref, "homework"));
          return { id: docSnap.id, ...docSnap.data(), items: countSnap.data().count, index: i };
        })
      );

      const sorted = data.sort((a, b) => {
        if (a.items > 0 && b.items > 0) return b.items - a.items;
        if (a.items > 0) return -1;
        if (b.items > 0) return 1;
        return a.index - b.index;
      }).map(({ index, ...s }) => s);

      setSubjects(sorted);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addSubject = useCallback(async (subject, color, icon) => {
    if (!user) return;
    await setDoc(doc(firestoreDB, "subjects", user.uid + subject), {
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
