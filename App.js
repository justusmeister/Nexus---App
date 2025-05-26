import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import { EmailContextProvider } from "./contexts/EmailContext";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { NativeModules } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { TimetableContextProvider } from "./contexts/TimetableContext";

const { EmailModule } = NativeModules;
SplashScreen.preventAutoHideAsync();

// Haupt-App-Komponente
const App = function () {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView>
      <ActionSheetProvider>
        <BottomSheetModalProvider>
          <TimetableContextProvider>
            <EmailContextProvider>
              <HolidayDataContextProvider>
                <Navigation />
                <StatusBar style="dark" />
                <Toast />
              </HolidayDataContextProvider>
            </EmailContextProvider>
          </TimetableContextProvider>
        </BottomSheetModalProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
};

export default App;
