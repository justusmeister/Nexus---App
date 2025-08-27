import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, useColorScheme } from "react-native";
import { MMKV } from "react-native-mmkv";

const ThemeContext = createContext();

const storage = new MMKV();

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();

  const initialPref = storage.getString("theme") || "system";
  const [themePref, setThemePref] = useState(initialPref);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const val = await AsyncStorage.getItem("theme");
        if (val === "light" || val === "dark" || val === "system") {
          Appearance.setColorScheme(val);
          setThemePref(val);
        } else {
          setThemePref("system");
        }
      } finally {
        setIsThemeReady(true); 
      }
    })();
  }, []);

  const setTheme = (pref) => {
    storage.set("theme", pref);
    setThemePref(pref);
  };

  const colorScheme = themePref === "system" ? systemScheme : themePref;

  return (
    <ThemeContext.Provider value={{ themePref, colorScheme, setTheme, isThemeReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemeContext);
}