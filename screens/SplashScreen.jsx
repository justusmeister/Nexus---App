import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Animated } from "react-native";
import { firebaseAuth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    const clearAsyncStorage = async () => {
      await AsyncStorage.removeItem("emails");
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (user) {
          navigation.navigate("Tabs");
        } else {
          navigation.navigate("AuthStack");
          clearAsyncStorage();
        }
        setLoading(false);
      });
    });

    return unsubscribe;
  }, [navigation, fadeAnim]);

  if (loading) {
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeAnim,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </Animated.View>
    );
  }

  return null;
};

export default SplashScreen;
