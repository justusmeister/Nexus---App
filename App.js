import axios from "axios";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { HolidayDataContextProvider } from "./contexts/HolidayDataContext";
import Toast from "react-native-toast-message";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const BASE_URL = "https://nessa.webuntis.com/WebUntis/jsonrpc.do?school=Ursulaschule+Osnabrueck";
const USERNAME = "justus.meister";
const PASSWORD = "u.g.i!JM08";
const CLIENT = "WebUntis";

let sessionId = null;

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
            startDate: "20250217",
            endDate: "20250221",
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
