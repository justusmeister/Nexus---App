import axios from "axios";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import { EmailContextProvider } from "./contexts/EmailContext";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LogRocket from '@logrocket/react-native';
LogRocket.init('lb7h2h/nexus')

const BASE_URL = "https://nessa.webuntis.com/WebUntis/jsonrpc.do?school=Ursulaschule+Osnabrueck";
const USERNAME = "justus.meister";
const PASSWORD = "u.g.i!JM08";
const CLIENT = "WebUntis";

let sessionId = null;

const getCurrentWeekDates = () => {
  const now = new Date();
  const currentDay = now.getDay();
  const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));

  // Format: YYYYMMDD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    startDate: formatDate(monday),
    endDate: formatDate(friday)
  };
};

const getSession = async () => {
  if (sessionId) return sessionId;

  try {
    //1. Request zum Abfragen der sessionId
    const response = await axios.post(BASE_URL, {
      id: 1,
      method: "authenticate",
      params: {
        user: USERNAME,
        password: PASSWORD,
        client: CLIENT,
      },
      jsonrpc: "2.0",
    });

    sessionId = response.data.result.sessionId;
    console.log("Login erfolgreich!");
    return sessionId;
  } catch (error) {
    console.log("Login fehlgeschlagen:", error);
    return null;
  }
};

const getTimetable = async () => {
  const { startDate, endDate } = getCurrentWeekDates();
  try {
    const session = await getSession();
    if (!session) return;

    //2. Request zum Abfragen des Stundenplans
    const response = await axios.post(
      BASE_URL,
      {
        id: 1,
        method: "getTimetable",
        params: {
          options: {
            element: {
              //Nutzer id und Nutzer type aus vorheriger Sessionabfrage
              id: 1676,
              type: 5,
            },
            startDate: startDate,
            endDate: endDate,
          },
        },
        jsonrpc: "2.0",
      },
      {
        headers: { Cookie: `JSESSIONID=${sessionId}` },
      }
    );

    console.log("Stundenplan:", JSON.stringify(response.data.result, null, 2));
  } catch (error) {
    console.log("Stundenplan fehlerhaft:", error);
  }
};

const App = function () {
  useEffect(() => {
    getTimetable();
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <EmailContextProvider>
          <HolidayDataContextProvider>
            <Navigation />
            <StatusBar style="dark" />
            <Toast />
          </HolidayDataContextProvider>
        </EmailContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
