// Formatiert das Datum für die Anzeige
export const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };
  
  // Gibt das Datum ohne Zeit zurück
  export const getDateWithoutTime = (date) => {
    return date.toISOString().split("T")[0]; // Gibt nur 'yyyy-mm-dd' zurück
  };