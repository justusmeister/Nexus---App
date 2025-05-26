import { useState, createContext, useContext } from "react";

const TimetableContext = createContext();

export const TimetableContextProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState();

  return (
    <TimetableContext.Provider value={{ timetableData, setTimetableData }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetableData = () => useContext(TimetableContext);
