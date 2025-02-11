import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import Toast from "react-native-toast-message";
import { WebUntis } from "webuntis";

const App = function () {
  useEffect(() => {
    async function fetchUnits() {
      console.log("test");

      try {
        const untis = new WebUntis(
          "ursusaschule",
          "astridmeister@gmx.de",
          "u.g.i!JM08",
          "nessa.webuntis.com"
        );
      } catch(e) {
        console.log(e);
      }
      console.log("test1");

      await untis.login();
      console.log("test2");

      try {
        const timetable = getOwnTimetableForToday(validateSession);
        console.log("test3");
      } catch {
        console.log("fehler");
      } finally {
        console.log(timetable);
      }
    }
    fetchUnits();
  }, []);

  return (
    <HolidayDataContextProvider>
      <Navigation />
      <StatusBar style="dark" />
      <Toast />
    </HolidayDataContextProvider>
  );
};

export default App;
