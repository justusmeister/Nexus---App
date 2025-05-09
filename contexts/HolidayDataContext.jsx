import { useState, createContext, useContext } from "react";

const HolidayDataContext = createContext();

export const HolidayDataContextProvider = ({ children }) => {
  const [holidayData, setHolidayData] = useState(new Map());

  return (
    <HolidayDataContext.Provider value={{ holidayData, setHolidayData }}>
      {children}
    </HolidayDataContext.Provider>
  );
};

export const useHolidayData = () => useContext(HolidayDataContext);
