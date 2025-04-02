import { useState, createContext, useContext } from "react";

const EmailContext = createContext();

export const EmailContextProvider = ({ children }) => {
  const [mailData, setMailData] = useState(["loading"]);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <EmailContext.Provider
      value={{ mailData, setMailData, refreshing, setRefreshing }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailData = () => useContext(EmailContext);
