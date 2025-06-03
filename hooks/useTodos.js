import { useState } from "react";
import {
    getDocs, addDoc, deleteDoc, doc, collection, query, orderBy, setDoc, serverTimestamp
} from "firebase/firestore";
import { firestoreDB } from "../firebaseConfig";
import { checkDeadlineRemainingTime } from "../utils/checkDeadlineRemainingTime";
import { formatTimestamp } from "../utils/formatTimestamp";

export const useTodos = (user, onError) => {
    const [todoList, setTodoList] = useState([]);
    const [loading, setLoading] = useState(true);

    const parseDateString = (dateString) => {
        const [day, month, year] = dateString.split(".").map(Number);
        return new Date(2000 + year, month - 1, day, 7, 0, 0);
    };

    const fetchTodos = async () => {
        if (!user) return;
        try {
            const todoRef = collection(firestoreDB, "todos", user.uid, "todos");
            const q = query(todoRef, orderBy("timestamp", "asc"));
            const querySnapshot = await getDocs(q);

            const fetchedTodos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                status: doc.data().status || false,
                canDelete:
                    checkDeadlineRemainingTime(formatTimestamp(doc.data().dueDate)).time === "delete",
            }));

            const currentDate = new Date();
            const upcoming = fetchedTodos
                .filter(t => parseDateString(formatTimestamp(t.dueDate)) >= currentDate)
                .sort((a, b) => parseDateString(formatTimestamp(a.dueDate)) - parseDateString(formatTimestamp(b.dueDate)));

            const past = fetchedTodos
                .filter(t => parseDateString(formatTimestamp(t.dueDate)) < currentDate)
                .sort((a, b) => parseDateString(formatTimestamp(b.dueDate)) - parseDateString(formatTimestamp(a.dueDate)));

            const sortedTodos = [...upcoming, ...past];

            setTodoList(sortedTodos);
            for (const todo of fetchedTodos) {
                if (todo.canDelete) await deleteTodo(todo.id);
            }
        } catch (e) {
            onError?.(e);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (dueDate, title = "Unbenannt", type, description = "-", priority) => {
        if (!user) return;
        try {
            setLoading(true);
            const todoRef = collection(firestoreDB, "todos", user.uid, "todos");
            await addDoc(todoRef, {
                dueDate,
                title,
                type,
                description,
                priority,
                timestamp: serverTimestamp(),
                status: false,
            });
        } catch (e) {
            onError?.(e);
        } finally {
            fetchTodos();
        }
    };

    const deleteTodo = async (id) => {
        if (!user) return;
        try {
            const ref = doc(firestoreDB, "todos", user.uid, "todos", id);
            await deleteDoc(ref);
        } catch (e) {
            onError?.(e);
        } finally {
            fetchTodos();
        }
    };

    const updateTodo = async (id, dueDate, title, type, description, priority) => {
        if (!user) return;
        try {
            const ref = doc(firestoreDB, "todos", user.uid, "todos", id);
            await setDoc(ref, {
                dueDate, title, type, description, priority, timestamp: serverTimestamp()
            }, { merge: true });
        } catch (e) {
            onError?.(e);
        }
    };

    const updateTodoStatus = async (id) => {
        if (!user) return;
        try {
            const ref = doc(firestoreDB, "todos", user.uid, "todos", id);
            await setDoc(ref, { status: true }, { merge: true });
        } catch (e) {
            onError?.(e);
        }
    };

    return {
        todoList,
        loading,
        fetchTodos,
        addTodo,
        deleteTodo,
        updateTodo,
        updateTodoStatus
    };
};
