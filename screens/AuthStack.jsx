import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./AuthScreens/LoginScreen";
import WelcomeScreen from "./AuthScreens/WelcomeScreen";
import RegistrationScreen from "./AuthScreens/RegistrationScreen";
import ForgotPasswordScreen from "./AuthScreens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

const AuthStack = function () {
  return (
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

export default AuthStack;