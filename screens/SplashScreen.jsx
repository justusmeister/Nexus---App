import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { firebaseAuth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clearAsyncStorage = async () => {
      await AsyncStorage.removeItem("emails");
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        navigation.navigate("Tabs");
      } else {
        navigation.navigate("LoginScreen");
        clearAsyncStorage();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2678C0" />
      </View>
    );
  }

  return null;
};

export default SplashScreen;
