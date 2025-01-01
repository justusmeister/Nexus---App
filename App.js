import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";

const App = function () {
  return (
    <HolidayDataContextProvider>
      <Navigation />
      <StatusBar style="dark" />
    </HolidayDataContextProvider>

  );
};

export default App;