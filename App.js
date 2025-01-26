import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import Toast from 'react-native-toast-message';

const App = function () {
  return (
    <HolidayDataContextProvider>
      <Navigation />
      <StatusBar style="dark" />
      <Toast />
    </HolidayDataContextProvider>

  );
};

export default App;