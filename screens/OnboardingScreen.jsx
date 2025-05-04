import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useWindowDimensions } from "react-native";

import FirstIllustration from "../assets/illustrations/producttour.svg";
import SecondIllustration from "../assets/illustrations/pushnotifications.svg";
import { setAsyncItem } from "../utils/asyncStorage";

const OnboardingScreen = function ({ navigation }) {
  const { width } = useWindowDimensions();
  const size = Math.min(width * 0.8, 400);

  const handleDone = () => {
    navigation.navigate("AuthStack");
    setAsyncItem("onboarded", "true");
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        containerStyles={styles.onboardingStyle}
        pages={[
          {
            backgroundColor: "#3C82E0",
            image: (
              <FirstIllustration
                width={size} // Macht das Bild responsiv basierend auf der Bildschirmbreite
                height={size} // Höhe ebenfalls an die Breite anpassen
              />
            ),
            title: "Deine Schulorganisation. Alles in einer App.",
            subtitle:
              "Untis Stundenplan, E-Mails, Aufgaben, Noten - alles in einer App!",
          },
          {
            backgroundColor: "#E26E6E",
            image: (
              <SecondIllustration
                width={size} // Macht das Bild responsiv basierend auf der Bildschirmbreite
                height={size} // Höhe ebenfalls an die Breite anpassen
              />
            ),
            title: "Benachrichtigungen aktivieren",
            subtitle:
              "Erhalte Benachrichtigungen für Fristen und Unterrichtsausfälle!",
          },
        ]}
        nextLabel="Weiter"
        skipLabel="Überspringen"
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  onboardingStyle: {
    paddingHorizontal: 15,
  },
});
