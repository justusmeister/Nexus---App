import {
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
  useEffect,
  memo,
} from "react";
import {
  TouchableOpacity,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Icon from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { RFPercentage } from "react-native-responsive-fontsize";
import GradesGenericScreen from "./GradesSubScreens/GradesGenericScreen";
import GradesScreen from "./GradesSubScreens/GradesScreen";

const Stack = createNativeStackNavigator();

const GradesStack = function ({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="GradesScreen">
      <Stack.Screen
        name="GradesScreen"
        component={GradesScreen}
        options={{
          title: "Noten",
          headerLargeTitle: true,
          headerStyle: { backgroundColor: "#EFEEF6" },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("SettingsScreen")}
              style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
              hitSlop={12}
            >
              <Icon.Feather name="settings" size={25 * 1.1} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="GradesGenericScreen"
        component={GradesGenericScreen}
        options={{
          title: "Fach",
          headerBackTitle: "Zurück",
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#a1a1a1",
  },
  monthOverviewContainer: {
    flex: 1,
    justifyContent: "center",
  },
  deadlineListView: {
    height: "50%",
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#EFEEF6",
  },
  sectionTitle: {
    fontSize: RFPercentage(2.44),
    fontWeight: "600",
    padding: 10,
    marginLeft: 10,
  },
  emptyListText: {
    width: "100%",
    textAlign: "center",
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#8E8E93",
  },
});

export default memo(GradesStack);
