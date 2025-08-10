import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themePref, setThemePref] = useState("system");

  useEffect(() => {
    AsyncStorage.getItem("theme").then((val) => {
      if (val === "light" || val === "dark" || val === "system") {
        setThemePref(val);
      } else {
        setThemePref("system");
      }
    });
  }, []);

  const setTheme = async (pref) => {
    await AsyncStorage.setItem("theme", pref);
    setThemePref(pref);
  };

  const colorScheme = themePref === "system" ? systemScheme : themePref;

  return (
    <ThemeContext.Provider value={{ themePref, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemeContext);
}
