import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useWindowDimensions } from "react-native";

import FirstIllustration from "../assets/illustrations/producttour.svg";  // Dein erstes SVG
import SecondIllustration from "../assets/illustrations/organizing.svg"; // Dein zweites SVG
import ThirdIllustration from "../assets/illustrations/pushnotifications.svg";   // Dein drittes SVG


const OnboardingScreen = function ({ navigation }) {
  const { width } = useWindowDimensions(); // Dynamische Breite des Screens

  return (
    <View style={styles.container}>
      <Onboarding
        containerStyles={styles.onboardingStyle}
        pages={[
          {
            backgroundColor: "#A7C9FF",
            image: (
                <FirstIllustration
                width={width * 0.6} // Macht das Bild responsiv basierend auf der Bildschirmbreite
                height={width * 0.6} // Höhe ebenfalls an die Breite anpassen
              />
            ),
            title: "Nexus - Dein Hub für den Schulalltag",
            subtitle:
              "Stundenplan, E-Mails, Aufgaben, Noten - alles in einer App",
          },
          {
            backgroundColor: "#FFEFC2",
            image: (
                <SecondIllustration
                width={width * 0.6} // Macht das Bild responsiv basierend auf der Bildschirmbreite
                height={width * 0.6} // Höhe ebenfalls an die Breite anpassen
              />
            ),
            title: "Organisiert wie du es brauchst",
            subtitle: "sortiere Aufgaben nach Fächern, Fristen und Prioritäten",
          },
          {
            backgroundColor: "#FFD6D6",
            image: (
                <ThirdIllustration
                width={width * 0.6} // Macht das Bild responsiv basierend auf der Bildschirmbreite
                height={width * 0.6} // Höhe ebenfalls an die Breite anpassen
              />
            ),
            title: "Benachrichtigungen aktivieren",
            subtitle:
              "Erhalte Benachrichtigungen für Fristen und Unterrichtsausfälle",
          },
        ]}
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
