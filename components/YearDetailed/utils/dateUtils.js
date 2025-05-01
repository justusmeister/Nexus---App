import { Timestamp } from "firebase/firestore";

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const parseDateToTimestamp = (dateString) => {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
};

export const parseDateToTimestampRange = (startDate, endDate) => ({
  start: parseDateToTimestamp(startDate),
  end: parseDateToTimestamp(endDate),
});

export const isToday = (day, month, year) => {
  if (day === null) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
};

export const formatDisplayDate = (day, month, year) => {
  return `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${
    day < 10 ? `0${day}` : day
  }`;
};

export const formatSelectedDate = (selectedDay, dateString) => {
  if (!selectedDay || !dateString) return null;

  const [year, month] = dateString.split("-");
  const formattedDay = String(selectedDay).padStart(2, "0");
  return `${year}-${month.padStart(2, "0")}-${formattedDay}`;
};