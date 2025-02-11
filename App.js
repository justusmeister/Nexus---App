import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import Toast from 'react-native-toast-message';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";

const App = function () {
  useEffect(() => {
  }, [])

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <HolidayDataContextProvider>
          <Navigation />
          <StatusBar style="dark" />
          <Toast />
        </HolidayDataContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>

  );
};

export default App;