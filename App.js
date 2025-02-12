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

    console.log(response.data);


    sessionId = response.data.result.sessionId;
    console.log("Erfolgreich eingeloggt!");
    return sessionId;
  } catch (error) {
    console.log("Login fehlgeschlagen:", error);
    return null;
  }
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0].replace(/-/g, "");
};

const getTimetable = async () => {
  try {
    const session = await getSession();
    if (!session) return;

    const response = await axios.post(
      BASE_URL,
      {
        id: 1,
        method: "getTimetable",
        params: {
          options: {
            element: {
              id: 1676,
              type: 5,
            },
            startDate: "20250210",
            endDate: "20250214",
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
    console.log("Fehler beim Abrufen des Stundenplans:", error);
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
