import { memo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GradesGenericScreen from "./GradesSubScreens/GradesGenericScreen";
import GradesScreen from "./GradesSubScreens/GradesScreen";
import CustomHeader from "../components/General/CustomHeader";

const Stack = createNativeStackNavigator();

function GradesStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="GradesScreen">
      <Stack.Screen
        name="GradesScreen"
        component={GradesScreen}
        options={{
          header: () => (
            <CustomHeader
              title="Noten"
              onSettingsPress={() => navigation.navigate("SettingsScreen")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="GradesGenericScreen"
        component={GradesGenericScreen}
        options={{
          title: "Fach",
          headerBackTitle: "Zurück",
        }}
      />
    </Stack.Navigator>
  );
}

export default memo(GradesStack);
