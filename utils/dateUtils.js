import { Timestamp } from "firebase/firestore";

// Format date from ISO string to localized German format
export const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  return (
    date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) +
    ", " +
    date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

// Parse date string from DD.MM.YY format to Date object
export const parseDateString = (dateString) => {
  if (!dateString) return new Date();

  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(2000 + year, month - 1, day, 7, 0, 0);
};

// Format timestamp from Firebase to DD.MM.YY format
export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  try {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
      ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
    }

    // Falls der Timestamp schon ein Date-Objekt ist
    if (timestamp instanceof Date) {
      const date = timestamp;
      return `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
      ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
    }
    return "";
  } catch (error) {
    console.error("Error while formatting timestamp:", error);
    return "";
  }
};

// Sort deadlines by date (upcoming first, then past)
export const sortDeadlinesByDate = (deadlines) => {
  if (!deadlines || deadlines[0] === "loading") return deadlines;

  const currentDate = new Date();

  const upcomingDues = deadlines
    .filter((d) => parseDateString(d.dueDate) >= currentDate)
    .sort((a, b) => parseDateString(a.dueDate) - parseDateString(b.dueDate));

  const pastDues = deadlines
    .filter((d) => parseDateString(d.dueDate) < currentDate)
    .sort((a, b) => parseDateString(b.dueDate) - parseDateString(a.dueDate));

  return [...upcomingDues, ...pastDues];
};