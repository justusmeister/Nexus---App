// components/CountrySelector.js
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COUNTRY_DATA } from '../constants/data';

const CountryButton = memo(({ 
  country, 
  countryData, 
  isSelected, 
  onPress, 
  isNavigating, 
  theme 
}) => (
  <TouchableOpacity
    style={[
      styles.modernCountrySelectorButton,
      isSelected && [
        styles.selectedCountryButton,
        { backgroundColor: theme.colors.primary }
      ]
    ]}
    onPress={() => onPress(country)}
    activeOpacity={0.7}
    disabled={isNavigating}
  >
    <Text style={styles.countryFlag}>{countryData.flag}</Text>
    <Text
      style={[
        styles.countrySelectorText,
        {
          color: isSelected ? '#FFFFFF' : theme.colors.text,
          fontFamily: theme.fonts?.medium || 'System'
        }
      ]}
    >
      {countryData.label}
    </Text>
  </TouchableOpacity>
));

const CountrySelector = memo(({ 
  selectedCountry, 
  onCountryChange, 
  isNavigating, 
  theme 
}) => {
  return (
    <View style={styles.countryHeader}>
      <Text style={[styles.countryHeaderLabel, { color: theme.colors.text + '80', fontFamily: theme.fonts?.regular || 'System' }]}>
        Land wählen:
      </Text>
      <View style={[styles.modernCountrySelector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {Object.entries(COUNTRY_DATA).map(([country, countryData]) => (
          <CountryButton
            key={country}
            country={country}
            countryData={countryData}
            isSelected={selectedCountry === country}
            onPress={onCountryChange}
            isNavigating={isNavigating}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  countryHeader: {
    marginBottom: 20,
  },
  countryHeaderLabel: {
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  modernCountrySelector: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    width: '100%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modernCountrySelectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  selectedCountryButton: {
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  countryFlag: {
    fontSize: 18,
  },
  countrySelectorText: {
    fontSize: 14,
  },
});

export default CountrySelector;