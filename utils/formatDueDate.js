export function formatDueDateFromTimestamp(timestamp) {
    if (!timestamp?.seconds) return "n.A.";

    const dueDate = new Date(timestamp.seconds * 1000);
    const today = new Date();

    // Setze beide auf Mitternacht zum Vergleich nur des Datums
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Heute";
    if (diffInDays === 1) return "Morgen";
    if (diffInDays === -1) return "Gestern";
    if (diffInDays > 1 && diffInDays < 7) return `in ${diffInDays} Tagen`;
    if (diffInDays === 7) return "in 1 Woche";
    if (diffInDays < -1 && diffInDays > -7) return `vor ${Math.abs(diffInDays)} Tagen`;
    if (diffInDays === -7) return "vor 1 Woche";

    // Alles andere → Datum im Format TT.MM.JJ
    return dueDate.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
}
