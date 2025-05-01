import { useState } from "react";
import {
    getDocs, addDoc, deleteDoc, doc, collection, query, orderBy, setDoc, serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../firebaseConfig";
import { checkDeadlineRemainingTime } from "../externMethods/checkDeadlineRemainingTime";
import { formatTimestamp } from "../externMethods/formatTimestamp";

export const useHomework = (user, subject, onDeadlineAdded, onError) => {
    const [homeworkList, setHomeworkList] = useState([]);
    const [loading, setLoading] = useState(true);

    const parseDateString = (dateString) => {
        const [day, month, year] = dateString.split(".").map(Number);
        return new Date(2000 + year, month - 1, day, 7, 0, 0);
    };

    const fetchHomework = async () => {
        if (!user) return;
        try {
            const subjectRef = doc(firestoreDB, "subjects", user.uid + subject);
            const homeworkRef = collection(subjectRef, "homework");
            const q = query(homeworkRef, orderBy("timestamp", "asc"));
            const querySnapshot = await getDocs(q);

            const fetchedHomework = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                status: doc.data().status || false,
                canDelete:
                    checkDeadlineRemainingTime(formatTimestamp(doc.data().dueDate)).time === "delete",
            }));

            const currentDate = new Date();
            const upcoming = fetchedHomework
                .filter(d => parseDateString(formatTimestamp(d.dueDate)) >= currentDate)
                .sort((a, b) => parseDateString(formatTimestamp(a.dueDate)) - parseDateString(formatTimestamp(b.dueDate)));

            const past = fetchedHomework
                .filter(d => parseDateString(formatTimestamp(d.dueDate)) < currentDate)
                .sort((a, b) => parseDateString(formatTimestamp(b.dueDate)) - parseDateString(formatTimestamp(a.dueDate)));

            const sortedHomework = [...upcoming, ...past];

            setHomeworkList(sortedHomework);
            for (const hw of fetchedHomework) {
                if (hw.canDelete) await deleteHomework(hw.id);
            }
        } catch (e) {
            onError?.(e);
        } finally {
            setLoading(false);
        }
    };

    const addHomework = async (title, startDate, dueDate, description, isDeadline) => {
        if (!user) return;
        try {
            setLoading(true);
            const subjectRef = doc(firestoreDB, "subjects", user.uid + subject);
            await addDoc(collection(subjectRef, "homework"), {
                title, startDate, dueDate, description,
                timestamp: serverTimestamp(), status: false,
            });
            if (isDeadline) onDeadlineAdded?.(title, dueDate, description);
        } catch (e) {
            onError?.(e);
        } finally {
            fetchHomework();
        }
    };

    const deleteHomework = async (id) => {
        if (!user) return;
        try {
            const ref = doc(firestoreDB, "subjects", user.uid + subject, "homework", id);
            await deleteDoc(ref);
        } catch (e) {
            onError?.(e);
        } finally {
            fetchHomework();
        }
    };

    const updateHomework = async (title, description, startDate, dueDate, id) => {
        if (!user) return;
        try {
            const ref = doc(firestoreDB, "subjects", user.uid + subject, "homework", id);
            await setDoc(ref, {
                title, description, startDate, dueDate, timestamp: serverTimestamp()
            }, { merge: true });
        } catch (e) {
            onError?.(e);
        }
    };

    const updateHomeworkStatus = async (id) => {
        if (!user) return;
        try {
            const ref = doc(firestoreDB, "subjects", user.uid + subject, "homework", id);
            await setDoc(ref, { status: true }, { merge: true });
        } catch (e) {
            onError?.(e);
        }
    };

    return {
        homeworkList, loading,
        fetchHomework, addHomework, deleteHomework, updateHomework, updateHomeworkStatus
    };
};
