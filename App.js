import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import { EmailContextProvider } from "./contexts/EmailContext";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Inter_500Regular,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { TimetableContextProvider } from "./contexts/TimetableContext";
import { ThemeProvider, useThemePreference } from "./hooks/useThemePreference";

SplashScreen.preventAutoHideAsync();

const App = function () {
  const [loaded, error] = useFonts({
    Inter_500Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AppContent loaded={loaded} error={error} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

function AppContent({ loaded, error }) {
  const { isThemeReady } = useThemePreference();

  useEffect(() => {
    if ((loaded || error) && isThemeReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isThemeReady]);

  if ((!loaded && !error) || !isThemeReady) return null;

  return (
    <ActionSheetProvider>
      <BottomSheetModalProvider>
        <TimetableContextProvider>
          <EmailContextProvider>
            <HolidayDataContextProvider>
              <Navigation />
              <StatusBar style="auto" />
              <Toast />
            </HolidayDataContextProvider>
          </EmailContextProvider>
        </TimetableContextProvider>
      </BottomSheetModalProvider>
    </ActionSheetProvider>
  );
}

export default App;
