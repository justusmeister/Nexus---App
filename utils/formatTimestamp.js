export const formatTimestamp = (timestamp) => {
    if (!timestamp) {
        return "";
    }
    const date = timestamp.toDate();
    return `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`;
};
