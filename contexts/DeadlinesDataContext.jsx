// DeadlinesDataContext.js
import React, { createContext, useState, useContext } from "react";



// Beispiel-Daten


// Provider-Komponente, die den Context bereitstellt
export const DeadlinesDataProvider = ({ children }) => {
  const [deadlinesData, setDeadlinesData] = useState(deadlinesDummyData);

  const changeData = (newData) => {
    setDeadlinesData(newData);
  };

  return (
    <DeadlinesContext.Provider value={{ deadlinesData, changeData }}>
      {children} {/* Kinder-Komponenten können auf den Context zugreifen */}
    </DeadlinesContext.Provider>
  );
};

// Custom Hook, um den Context zu konsumieren
export const useDeadlinesData = () => useContext(DeadlinesContext);