// components/RegionSlide.js
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountrySelector from './CountrySelector';
import RegionsList from './RegionsList';

const { height: screenHeight } = Dimensions.get('window');

const RegionSlide = memo(({ 
  selectedCountry, 
  selectedRegion, 
  onCountryChange, 
  onRegionSelect, 
  isNavigating, 
  theme 
}) => {
  return (
    <ScrollView contentContainerStyle={styles.slideContentRegion} showsVerticalScrollIndicator={false}>
      <View
        style={styles.slideContentRegion}
      >
        <View style={styles.regionHeader}>
          <Text style={[styles.slideTitle, { color: theme.colors.text, fontFamily: theme.fonts?.bold || 'System' }]}>
            Wo wohnst du?
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.colors.text, fontFamily: theme.fonts?.regular || 'System' }]}>
            Dies wird für lokale Funktionen benötigt
          </Text>
          <Text style={[styles.requiredText, { color: theme.colors.primary, fontFamily: theme.fonts?.semibold || 'System' }]}>
            (Pflicht)
          </Text>
        </View>

        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={onCountryChange}
          isNavigating={isNavigating}
          theme={theme}
        />

        <RegionsList
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          onRegionSelect={onRegionSelect}
          isNavigating={isNavigating}
          theme={theme}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  slideContentRegion: {
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: screenHeight * 0.7,
  },
  regionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  slideSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.8,
    lineHeight: 22,
  },
  requiredText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
});

export default RegionSlide;